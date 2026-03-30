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
import { BarChart3, MessageSquare, LogOut } from "lucide-react";
import { logout } from "@/app/actions/logout";
import AnalyticsDashboard from "@/app/components/AnalyticsDashboard";

export default function AnalyticsPageClient() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar className="hidden lg:block">
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-400/20 flex items-center justify-center">
              <span className="text-amber-400 font-bold">M</span>
            </div>
            <div>
              <div className="text-xs text-slate-400">Manager</div>
              <div className="text-sm font-semibold">Dashboard</div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/manager" className="block w-full">
                <SidebarMenuButton icon={<MessageSquare className="h-4 w-4" />}>
                  Conversations
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/manager/analytics" className="block w-full">
                <SidebarMenuButton
                  isActive
                  icon={<BarChart3 className="h-4 w-4" />}
                >
                  Analytics
                </SidebarMenuButton>
              </Link>
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
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <AnalyticsDashboard />
          </div>
        </div>
      </main>
    </div>
  );
}
