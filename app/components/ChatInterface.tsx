"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";

import { useState } from "react";
import { Bot, Send, Square, User as UserIcon, MessageSquare } from "lucide-react";
import { Button } from "@/lib/components/button";
import { Input } from "@/lib/components/input";
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
    <div className="flex h-full flex-col p-6">
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-200">
          <p className="font-medium">Error</p>
          <p>{error.message}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.length === 0 && !isBusy && (
          <div className="h-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Start a conversation</p>
            </div>
          </div>
        )}
        
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] flex gap-3 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                    isUser ? "bg-amber-500/20 border border-amber-400/40" : "bg-sky-500/20 border border-sky-400/40"
                  }`}
                >
                  {isUser ? (
                    <UserIcon className="h-4 w-4 text-amber-300" aria-hidden="true" />
                  ) : (
                    <Bot className="h-4 w-4 text-sky-300" aria-hidden="true" />
                  )}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-amber-500/15 border border-amber-400/30 text-slate-100"
                      : "bg-white/5 border border-white/10 text-slate-100"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            key={`${message.id}-${index}`}
                            className="whitespace-pre-wrap wrap-break-word"
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
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-400/20 border-t-sky-400" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-white/10 bg-white/5 backdrop-blur p-4"
      >
        <div className="flex items-end gap-3">
          <textarea
            className="flex-1 resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0 max-h-24"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isBusy && input.trim()) {
                  (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
                }
              }
            }}
          />

          {isBusy ? (
            <Button
              type="button"
              onClick={stop}
              variant="destructive"
              size="sm"
            >
              <Square className="h-3 w-3 mr-1" />
              Stop
            </Button>
          ) : (
            <Button
              type="submit"
              size="sm"
              disabled={status !== "ready" || !input.trim()}
            >
              <Send className="h-3 w-3 mr-1" />
              Send
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
