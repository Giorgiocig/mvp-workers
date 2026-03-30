"use client";

import { useState, useEffect } from "react";
import { Factory, HardHat, MessageSquare, User } from "lucide-react";
import { DashboardMessage } from "@/lib/utilities/types";
import { Conversation } from "@/lib/utilities/interfaces";
import { getWorkerConversations } from "../actions/getConversationForSpecificUser";
import { getAllWorkers } from "../actions/getAllWorkers";
import { getMessages } from "../actions/getMessages";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/card";
import { Spinner } from "@/lib/components/spinner";

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Workers Column */}
      <Card className="lg:col-span-1">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HardHat className="h-5 w-5 text-amber-400" aria-hidden="true" />
            Workers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-h-125 overflow-y-auto">
          {isLoadingWorkers ? (
            <div className="flex justify-center items-center py-8">
              <Spinner />
            </div>
          ) : workers.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm">
              No workers found
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {workers.map((worker) => (
                <button
                  key={worker.id}
                  onClick={() => handleSelectWorker(worker)}
                  className={`w-full p-3 rounded-lg text-left transition-all border ${
                    selectedWorker?.id === worker.id
                      ? "border-amber-400/60 bg-amber-400/10 text-amber-100"
                      : "border-white/10 hover:bg-white/5 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="font-medium truncate">{worker.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversations Column */}
      <Card className="lg:col-span-1">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Factory className="h-5 w-5 text-sky-400" aria-hidden="true" />
            <span className="truncate">
              {selectedWorker
                ? `${selectedWorker.name}'s Chats`
                : "Conversations"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-h-125 overflow-y-auto">
          {!selectedWorker ? (
            <div className="p-4 text-center text-slate-400 text-sm">
              Select a worker to view conversations
            </div>
          ) : isLoadingConversations ? (
            <div className="flex justify-center items-center py-8">
              <Spinner />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm">
              No conversations yet
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${
                    selectedConversation === conv.id
                      ? "border-amber-400/40 bg-amber-400/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="font-medium text-slate-100 truncate text-sm">
                    {conv.title || "Untitled"}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages Column */}
      <Card className="lg:col-span-1">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare
              className="h-5 w-5 text-sky-400"
              aria-hidden="true"
            />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-h-125 overflow-y-auto">
          {!selectedConversation ? (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a conversation</p>
              </div>
            </div>
          ) : isLoadingMessages ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <p className="text-sm">No messages</p>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] px-4 py-2 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-amber-500/20 text-slate-100 border border-amber-400/30"
                        : "bg-white/5 text-slate-100 border border-white/10"
                    }`}
                  >
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
        </CardContent>
      </Card>
    </div>
  );
}
