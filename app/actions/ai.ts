"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { requireAuth } from "./requireAuth";
import { updateConversationTitle } from "./updateConversationTitle";


/**
 * Generate a conversation title based on the first user message
 */
export async function generateConversationTitle(
  conversationId: string,
  firstMessage: string,
): Promise<{ success: boolean; title?: string; error?: string }> {
  await requireAuth();

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate a short, descriptive title (max 5 words) in Italian for a conversation that starts with: "${firstMessage}". 
      
Return ONLY the title, no quotes, no extra text. Keep it professional and relevant to manufacturing/production context.

Examples:
- User: "Come funziona il tornio CNC?" → Title: "Guida tornio CNC"
- User: "Ho un problema con la pressa" → Title: "Problema pressa idraulica"
- User: "Quali sono le procedure di sicurezza?" → Title: "Procedure di sicurezza"`,
    });

    const title = text.trim();

    // Update the conversation with the new title
    const result = await updateConversationTitle(conversationId, title);

    if (result.success) {
      return { success: true, title };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error generating title:", error);
    return {
      success: false,
      error: "Errore durante la generazione del titolo",
    };
  }
}
