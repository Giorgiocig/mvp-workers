import { createSupabaseServerClient } from "@/lib/supabaseServer";
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

    if (!userId) return new Response("Non autenticato", { status: 401 });

    const {
      messages,
      conversationId,
    }: { messages: UIMessage[]; conversationId: string } = await req.json();

    if (!conversationId)
      return new Response("conversationId richiesto", { status: 400 });

    const supabase = await createSupabaseServerClient();
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("user_id")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation || conversation.user_id !== userId) {
      return new Response("Conversazione non trovata", { status: 404 });
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: await convertToModelMessages(messages),
      system: `Sei un assistente AI per workers...`,
      onFinish: async ({ response }) => {
        const lastUserMessage = messages[messages.length - 1];

        for (const msg of [lastUserMessage, ...response.messages]) {
          await supabase.from("messages").insert({
            conversation_id: conversationId,
            role: msg.role,
            parts: msg.parts ?? msg.content,
          });
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Errore del server", { status: 500 });
  }
}
