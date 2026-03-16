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
