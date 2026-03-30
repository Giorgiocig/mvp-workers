"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/lib/components/sidebar";
import { Button } from "@/lib/components/button";
import { MessageSquare, LogOut } from "lucide-react";
import { logout } from "@/app/actions/logout";
import WorkerDashboard from "@/app/components/WorkerDashboard";
import { User } from "@/lib/utilities/interfaces";

export default function WorkerPageClient({ user }: { user: User }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar className="hidden lg:block">
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-sky-400/20 flex items-center justify-center">
              <span className="text-sky-400 font-bold">W</span>
            </div>
            <div>
              <div className="text-xs text-slate-400">{user.name}</div>
              <div className="text-sm font-semibold">Chat Assistant</div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton icon={<MessageSquare className="h-4 w-4" />}>
                Conversations
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <WorkerDashboard user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}
