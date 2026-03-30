import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { SYSTEM_PROMPT } from "@/lib/utilities/prompt";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const workerSession = cookieStore.get("user_session")?.value;

    let userId: string | null = null;

    if (workerSession) {
      try {
        const session = JSON.parse(workerSession);
        userId = session.userId;
      } catch {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) userId = user.id;
      }
    }

    if (!userId) return new Response("Not authenticated", { status: 401 });

    const {
      messages,
      conversationId,
    }: { messages: UIMessage[]; conversationId: string } = await req.json();

    if (!conversationId)
      return new Response("conversationId is required", { status: 400 });

    const supabase = await createSupabaseServerClient();
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("user_id")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation || conversation.user_id !== userId) {
      return new Response("Conversation not found", { status: 404 });
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: await convertToModelMessages(messages),
      system: SYSTEM_PROMPT,
      onFinish: async ({ response, usage }) => {
        // save message
        const lastUserMessage = messages[messages.length - 1];

        for (const msg of [lastUserMessage, ...response.messages]) {
          await supabase.from("messages").insert({
            conversation_id: conversationId,
            role: msg.role,
            parts:
              "parts" in msg
                ? msg.parts
                : "content" in msg
                  ? msg.content
                  : null,
          });
        }
        // stats
        const inputCost = usage.inputTokens
          ? (usage.inputTokens / 1_000_000) * 0.15
          : 0;
        const outputCost = usage.outputTokens
          ? (usage.outputTokens / 1_000_000) * 0.6
          : 0;
        const totalCost = inputCost + outputCost;
        await supabase.from("api_usage").insert({
          user_id: userId,
          conversation_id: conversationId,
          model: "gpt-4o-mini",
          prompt_tokens: usage.inputTokens,
          completion_tokens: usage.outputTokens,
          total_tokens: usage.totalTokens,
          cost_usd: totalCost,
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Server error", { status: 500 });
  }
}
