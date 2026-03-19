"use client";

import { useState, useEffect } from "react";
import { Factory, HardHat, MessageSquare, User } from "lucide-react";
import { DashboardMessage } from "@/lib/utilities/types";
import { Conversation } from "@/lib/utilities/interfaces";
import { getWorkerConversations } from "../actions/getConversationForSpecificUser";
import { getAllWorkers } from "../actions/getAllWorkers";
import { getMessages } from "../actions/getMessages";

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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-4">
        {/* Colonna 1 - Workers */}
        <div className="w-72 surface rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-slate-100 flex items-center gap-2">
              <HardHat className="h-4 w-4 text-amber-400" aria-hidden="true" />
              Workers
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {isLoadingWorkers ? (
              <div className="text-center text-slate-400">Caricamento...</div>
            ) : (
              workers.map((worker) => (
                <button
                  key={worker.id}
                  onClick={() => handleSelectWorker(worker)}
                  className={`w-full p-4 rounded-xl border text-left transition-all surface hover:bg-white/10 ${
                    selectedWorker?.id === worker.id
                      ? "border-amber-400/60 bg-white/10"
                      : "border-white/10"
                  }`}
                >
                  <div className="mb-2">
                    <User className="h-7 w-7 text-slate-300" aria-hidden="true" />
                  </div>
                  <div className="font-semibold text-slate-100">
                    {worker.name}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Colonna 2 - Conversazioni del worker selezionato */}
        <div className="w-72 surface rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-slate-100 flex items-center gap-2">
              <Factory className="h-4 w-4 text-sky-400" aria-hidden="true" />
              {selectedWorker
                ? `Conversazioni di ${selectedWorker.name}`
                : "Conversazioni"}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!selectedWorker ? (
              <div className="p-4 text-center text-slate-400 text-sm">
                Seleziona un worker
              </div>
            ) : isLoadingConversations ? (
              <div className="p-4 text-center text-slate-400">
                Caricamento...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">
                Nessuna conversazione
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full text-left px-4 py-3 border-b border-white/10 hover:bg-white/10 transition-colors ${
                    selectedConversation === conv.id
                      ? "bg-white/10 border-l-4 border-l-amber-400"
                      : ""
                  }`}
                >
                  <div className="font-medium text-slate-100 truncate">
                    {conv.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(conv.updated_at).toLocaleDateString("it-IT")}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Colonna 3 - Messaggi */}
        <div className="flex-1 surface rounded-2xl overflow-hidden flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-slate-300 mb-2">
                  <MessageSquare className="h-5 w-5 text-sky-400" aria-hidden="true" />
                  <p className="text-lg text-slate-200">Nessuna chat selezionata</p>
                </div>
                <p className="text-sm">Seleziona una conversazione</p>
              </div>
            </div>
          ) : isLoadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400" />
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
                        ? "bg-amber-500/20 text-slate-100 border border-amber-400/20"
                        : "bg-white/5 text-slate-100 border border-white/10"
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
