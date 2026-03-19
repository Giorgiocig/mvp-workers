"use client";

import { useState, useEffect } from "react";
import { HardHat, MessageSquare, Plus, Trash2 } from "lucide-react";

import ChatInterface from "@/app/components/ChatInterface";


import { Conversation, Message, User } from "@/lib/utilities/interfaces";
import { getConversations } from "../actions/getConversations";
import { createConversation } from "../actions/createConversation";
import { deleteConversation } from "../actions/deleteConversation";
import { getMessages } from "../actions/getMessages";

export default function WorkerDashboard({ user }: { user: User }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    const data = await getConversations();
    setConversations(data);
    setIsLoadingConversations(false);

    // Auto-select first conversation
    if (data.length > 0 && !activeConversation) {
      setActiveConversation(data[0].id);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    const data = await getMessages(conversationId);
    setMessages(data);
    setIsLoadingMessages(false);
  };

  const handleCreateConversation = async () => {
    setIsCreating(true);
    const result = await createConversation();
    if (result.success && result.conversationId) {
      await loadConversations();
      setActiveConversation(result.conversationId);
    }
    setIsCreating(false);
  };

  const handleDeleteConversation = async (
    conversationId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation(); // Prevent selecting the conversation

    if (!confirm("Sei sicuro di voler eliminare questa conversazione?")) {
      return;
    }

    const result = await deleteConversation(conversationId);

    if (result.success) {
      // If we deleted the active conversation, clear it
      if (activeConversation === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }
      // Reload conversations list
      await loadConversations();
    } else {
      alert(result.error || "Errore durante l'eliminazione");
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation);
    }
  }, [activeConversation]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-4">
        <div className="w-80 surface rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-slate-100 flex items-center gap-2 truncate">
                  <HardHat className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  {user.name}
                </h1>
                <p className="text-xs text-slate-400">Worker Dashboard</p>
              </div>
              <div className="h-9 w-9 rounded-xl surface-strong flex items-center justify-center">
                <HardHat className="h-4 w-4 text-slate-200" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-white/10">
            <button
              onClick={handleCreateConversation}
              disabled={isCreating}
              className="w-full px-4 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 bg-amber-500/20 hover:bg-amber-500/30 text-slate-100 border border-amber-400/20"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Plus className="h-4 w-4 text-amber-300" aria-hidden="true" />
                {isCreating ? "Creazione..." : "Nuova Conversazione"}
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="p-4 text-center text-slate-400">
                Caricamento...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-slate-400">
                <p className="text-sm text-slate-300">Nessuna conversazione</p>
                <p className="text-xs mt-1">Crea la tua prima chat</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`relative group flex items-center border-b border-white/10 hover:bg-white/10 transition-colors ${
                    activeConversation === conv.id
                      ? "bg-white/10 border-l-4 border-l-amber-400"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => setActiveConversation(conv.id)}
                    className="flex-1 text-left px-4 py-3"
                  >
                    <div className="font-medium text-slate-100 truncate pr-8">
                      {conv.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(conv.updated_at).toLocaleDateString("it-IT")}
                    </div>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Elimina conversazione"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 surface rounded-2xl overflow-hidden flex flex-col">
          {activeConversation ? (
            isLoadingMessages ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400" />
              </div>
            ) : (
              <ChatInterface
                key={activeConversation}
                conversationId={activeConversation}
                initialMessages={messages}
                onTitleGenerated={loadConversations}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-slate-300 mb-2">
                  <MessageSquare className="h-5 w-5 text-sky-400" aria-hidden="true" />
                  <p className="text-lg text-slate-200">Nessuna chat selezionata</p>
                </div>
                <p className="text-sm">Seleziona o crea una conversazione</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
