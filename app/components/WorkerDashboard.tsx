"use client";

import { useState, useEffect } from "react";

import { getMessages, type Message } from "@/app/actions/messages";
import ChatInterface from "@/app/components/ChatInterface";
import {
  Conversation,
  createConversation,
  getConversations,
} from "../actions/conversation";

import { User } from "@/lib/utilities/interfaces";

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
    console.log("messaggi caricati dal DB:", data);
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
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    activeConversation === conv.id
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="font-medium text-gray-900 truncate">
                    {conv.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(conv.updated_at).toLocaleDateString("it-IT")}
                  </div>
                </button>
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
