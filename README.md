# 🏭 Factory AI Assistant

An AI-powered chat application for manufacturing workers and managers built with Next.js, Supabase, and the Vercel AI SDK. Workers can chat with an AI assistant for help with daily tasks, production procedures, and technical problem-solving. Managers can monitor all worker conversations from a dedicated dashboard.

# Features

Worker chat interface — persistent AI conversations with context memory
Manager dashboard — read-only view of all worker conversations
Conversation persistence — chat history saved to Supabase and restored on reload
Auto-generated titles — conversation titles generated automatically from the first message
Role-based access — workers can only see their own chats, managers can see everything

# Tech Stack

Next.js 14 (App Router)
Supabase — database and auth
Vercel AI SDK — streaming chat with useChat
OpenAI GPT-4o mini — language model
TypeScript, Tailwind CSS

# How to Use

## Workers

Go to /login
Select your name from the list — no password required
You will be redirected to your personal dashboard
Create a new conversation with the ➕ New conversation button
Chat with the AI assistant about tasks, procedures, or technical questions
Your conversations are saved automatically and persist across sessions

## Manager

Go to /login
Password: admin
Click "Sign in as manager"

You will be redirected to the manager dashboard
Click on a worker card to see their conversations
Click on a conversation to read the full chat history (read-only)

# Project Structure

app/
actions/ # Server actions (business logic)
components/ # React components
worker/ # Worker pages
manager/ # Manager pages
lib/
repositories/ # Database access layer
conversationRepository.ts
messageRepository.ts
userRepository.ts
guards.ts # Role-based auth helpers
types.ts # Shared TypeScript types
supabaseServer.ts # Supabase client

# Architecture Notes

The project follows a layered architecture:

Repositories (lib/repositories/) — all direct Supabase queries live here
Server Actions (app/actions/) — business logic and authorization checks
Guards (lib/guards.ts) — role enforcement used in page components
Components — pure UI, no direct DB access

This separation makes it easy to swap the database layer, add new roles, or write tests without touching the UI.

# Notes

Worker sessions are stored in an HTTP-only cookie and expire after 8 hours
Manager authentication uses Supabase Auth (email + password)
Messages are stored in JSONB format to preserve the full AI SDK UIMessage structure
The AI assistant responds in Italian and is prompted with a manufacturing/production context
