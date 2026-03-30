"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "./button";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar");
  }
  return context;
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
        <div className="flex min-h-screen bg-background">
          {/* Sidebar */}
          <div
            ref={ref}
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-white/10 backdrop-blur transition-transform duration-300 lg:relative lg:translate-x-0",
              isOpen ? "translate-x-0" : "-translate-x-full",
              className,
            )}
            {...props}
          >
            <div className="flex h-full flex-col">{children}</div>
          </div>

          {/* Overlay for mobile */}
          {isOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Toggle button - only visible on mobile */}
          <div className="fixed bottom-4 left-4 z-50 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-surface hover:bg-surface-strong"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </SidebarContext.Provider>
    );
  },
);
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6 border-b border-white/10",
      className,
    )}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto px-4 py-6", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-t border-white/10 p-6", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}

const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("space-y-2", className)} {...props} />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  isActive?: boolean;
}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, isActive, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "rounded-lg transition-colors",
        isActive && "bg-accent/20",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuItem.displayName = "SidebarMenuItem";

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  icon?: React.ReactNode;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive, icon, children, ...props }, ref) => {
  const { setIsOpen } = useSidebar();

  return (
    <button
      ref={ref}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/10",
        isActive && "bg-amber-400/20 text-amber-400",
        className,
      )}
      onClick={(e) => {
        setIsOpen(false);
        props.onClick?.(e);
      }}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};
