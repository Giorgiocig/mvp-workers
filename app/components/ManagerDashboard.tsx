"use client";

import { useState, useEffect } from "react";
import { getMessages } from "../actions/messages";
import { DashboardMessage } from "@/lib/utilities/types";
import { Conversation } from "@/lib/utilities/interfaces";
import { getWorkerConversations } from "../actions/getConversationForSpecificUser";
import { getAllWorkers } from "../actions/getAllWorkers";



export default function ManagerDashboard() {
  const [workers, setWorkers] = useState<{ id: string; name: string }[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<DashboardMessage[]>([]);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(true);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    getAllWorkers().then((data) => {
      setWorkers(data);
      setIsLoadingWorkers(false);
    });
  }, []);

  const handleSelectWorker = async (worker: { id: string; name: string }) => {
    setSelectedWorker(worker);
    setSelectedConversation(null);
    setMessages([]);
    setIsLoadingConversations(true);
    const data = await getWorkerConversations(worker.id);
    setConversations(data);
    setIsLoadingConversations(false);
  };

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversation(conversationId);
    setIsLoadingMessages(true);
    const data = await getMessages(conversationId);
    setMessages(data as DashboardMessage[]);
    setIsLoadingMessages(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            🏭 Manager Dashboard
          </h1>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Colonna 1 - Workers */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-700">👷 Workers</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {isLoadingWorkers ? (
              <div className="text-center text-gray-400">Caricamento...</div>
            ) : (
              workers.map((worker) => (
                <button
                  key={worker.id}
                  onClick={() => handleSelectWorker(worker)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedWorker?.id === worker.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-2xl mb-1">👤</div>
                  <div className="font-semibold text-gray-900">
                    {worker.name}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Colonna 2 - Conversazioni del worker selezionato */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-700">
              {selectedWorker
                ? `💬 Conversazioni di ${selectedWorker.name}`
                : "💬 Conversazioni"}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!selectedWorker ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                Seleziona un worker
              </div>
            ) : isLoadingConversations ? (
              <div className="p-4 text-center text-gray-400">
                Caricamento...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                Nessuna conversazione
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedConversation === conv.id
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

        {/* Colonna 3 - Messaggi */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">💬 Nessuna chat selezionata</p>
                <p className="text-sm">Seleziona una conversazione</p>
              </div>
            </div>
          ) : isLoadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    {/* gestisci sia parts (nuovo formato) che content (vecchio) */}
                    {msg.parts
                      ? msg.parts
                          .filter((p) => p.type === "text")
                          .map((p) => p.text ?? "")
                          .join("")
                      : msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
