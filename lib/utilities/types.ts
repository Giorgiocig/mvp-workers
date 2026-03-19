import { Message } from "@/app/actions/messages";

export type UserRole = "worker" | "manager";

type MessagePart = {
  type: string;
  text?: string;
};

export type DashboardMessage = Message & {
  parts?: MessagePart[];
};
