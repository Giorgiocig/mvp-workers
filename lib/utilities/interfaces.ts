import { UserRole } from "./types";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface SessionPayload {
  userId: string;
  name: string;
  role: UserRole;
  expiresAt: Date;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};
