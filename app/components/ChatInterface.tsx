"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";

import { useState } from "react";
import { Bot, Send, Square, User as UserIcon } from "lucide-react";
import { generateConversationTitle } from "../actions/ai";

export default function ChatInterface({
  conversationId,
  initialMessages,
  onTitleGenerated,
}: any) {
  const [input, setInput] = useState("");
  const [hasGeneratedTitle, setHasGeneratedTitle] = useState(false);

  const { messages, sendMessage, status, error, stop } = useChat({
    messages: (initialMessages ?? []).map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      parts: msg.parts,
    })) as UIMessage[],
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest({ messages }) {
        return {
          body: {
            messages,
            conversationId,
          },
        };
      },
    }),
  });

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    const isFirstMessage = messages.length === 0;
    setInput("");

    if (isFirstMessage && !hasGeneratedTitle) {
      setHasGeneratedTitle(true);
      generateConversationTitle(conversationId, userMessage)
        .then(() => onTitleGenerated())
        .catch((err) => console.error("Failed to generate title:", err));
    }
    sendMessage({ text: userMessage });
  };

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-full flex-col">
      {error && (
        <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/40 px-3 py-2 text-sm text-red-200">
          {error.message}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] flex gap-3 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                    isUser ? "bg-amber-500/20 border border-amber-400/40" : "bg-sky-500/15 border border-sky-400/40"
                  }`}
                >
                  {isUser ? (
                    <UserIcon className="h-4 w-4 text-amber-300" aria-hidden="true" />
                  ) : (
                    <Bot className="h-4 w-4 text-sky-300" aria-hidden="true" />
                  )}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-amber-500/20 border border-amber-400/30 text-slate-100"
                      : "bg-white/5 border border-white/15 text-slate-100"
                  }`}
                >
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">
                    {isUser ? "Worker" : "Assistant"}
                  </div>
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            key={`${message.id}-${index}`}
                            className="whitespace-pre-wrap"
                          >
                            {part.text}
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isBusy && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-400" />
            Sto pensando...
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-2xl surface border border-white/10 px-3 py-2"
      >
        <div className="flex items-end gap-2">
          <textarea
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi un messaggio per l'assistente..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isBusy) {
                  // simulate submit
                  (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
                }
              }
            }}
          />

          {isBusy ? (
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-100 hover:bg-red-500/20 transition-colors"
            >
              <Square className="mr-1 h-3 w-3" aria-hidden="true" />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl border border-sky-400/40 bg-sky-500/20 px-3 py-2 text-xs font-medium text-sky-100 hover:bg-sky-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={status !== "ready" || !input.trim()}
            >
              <Send className="mr-1 h-3 w-3" aria-hidden="true" />
              Invia
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
