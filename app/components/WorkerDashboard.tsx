"use client";

import { useState, useEffect } from "react";
import { HardHat, MessageSquare, Plus, Trash2 } from "lucide-react";

import ChatInterface from "@/app/components/ChatInterface";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/card";
import { Button } from "@/lib/components/button";
import { Spinner } from "@/lib/components/spinner";

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

    if (!confirm("Are you sure you want to delete this conversation?")) {
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
      alert(result.error || "Error while deleting the conversation");
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Sidebar - Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HardHat className="h-5 w-5 text-amber-400" aria-hidden="true" />
            <span className="truncate">{user.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <Button
              onClick={handleCreateConversation}
              disabled={isCreating}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? "Creating..." : "New chat"}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-125">
            {isLoadingConversations ? (
              <div className="flex justify-center items-center py-8">
                <Spinner />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-slate-400">
                <p className="text-sm text-slate-300">No conversations yet</p>
                <p className="text-xs mt-1">Create your first chat</p>
              </div>
            ) : (
              <div className="space-y-1 p-4">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center group rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <button
                      onClick={() => setActiveConversation(conv.id)}
                      className={`flex-1 text-left px-3 py-3 rounded-lg transition-colors ${
                        activeConversation === conv.id
                          ? "bg-amber-400/10 text-amber-100"
                          : "text-slate-300"
                      }`}
                    >
                      <div className="font-medium truncate text-sm">
                        {conv.title || "Untitled"}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </div>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="p-2 text-slate-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all mr-1"
                      title="Delete conversation"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="lg:col-span-2">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare
              className="h-5 w-5 text-sky-400"
              aria-hidden="true"
            />
            Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          {activeConversation ? (
            isLoadingMessages ? (
              <div className="flex justify-center items-center h-96">
                <Spinner />
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
            <div className="flex items-center justify-center h-96 text-slate-400">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select or create a conversation</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
