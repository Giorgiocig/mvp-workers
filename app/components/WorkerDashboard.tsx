"use client";

import { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">👷 {user.name}</h1>
            <p className="text-sm text-gray-500">Worker Dashboard</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={handleCreateConversation}
              disabled={isCreating}
              className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isCreating ? "Creazione..." : "➕ Nuova Conversazione"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="p-4 text-center text-gray-400">
                Caricamento...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p className="text-sm">Nessuna conversazione</p>
                <p className="text-xs mt-1">Crea la tua prima chat!</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`relative group flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    activeConversation === conv.id
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => setActiveConversation(conv.id)}
                    className="flex-1 text-left px-4 py-3"
                  >
                    <div className="font-medium text-gray-900 truncate pr-8">
                      {conv.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(conv.updated_at).toLocaleDateString("it-IT")}
                    </div>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Elimina conversazione"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {activeConversation ? (
            isLoadingMessages ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400" />
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
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">💬 Nessuna chat selezionata</p>
                <p className="text-sm">Seleziona o crea una conversazione</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
