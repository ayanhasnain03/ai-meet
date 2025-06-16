"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";

const firstSection = [
  { icon: VideoIcon, label: "Meetings", href: "/meetings" },
  { icon: BotIcon, label: "Agents", href: "/agents" },
];

const secondSection = [{ icon: StarIcon, label: "Upgrade", href: "/upgrade" }];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 text-foreground">
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-3 p-4 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.svg"
            alt="Meet.AI logo"
            width={42}
            height={42}
            className="h-[42px] w-[42px] drop-shadow-lg"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Meet.AI
          </span>
        </Link>
      </SidebarHeader>

      <div className="px-4">
        <Separator className="opacity-20 mb-3 text-muted" />
      </div>

      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {firstSection.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 relative overflow-hidden group",
                      isActive &&
                        "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-4 border-l-cyan-400"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 w-full"
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive
                            ? "text-cyan-400"
                            : "text-gray-400 group-hover:text-gray-200"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isActive
                            ? "text-white"
                            : "text-gray-300 group-hover:text-white"
                        )}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 animate-pulse" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>

        <div className="px-4 py-2">
          <Separator className="opacity-20" />
        </div>

        <SidebarGroupContent>
          <SidebarMenu>
            {secondSection.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "relative group overflow-hidden",
                      isActive &&
                        "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-l-4 border-l-yellow-400"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-md w-full"
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isActive
                            ? "text-yellow-400"
                            : "text-yellow-500 group-hover:text-yellow-300"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isActive
                            ? "text-white"
                            : "text-gray-300 group-hover:text-white"
                        )}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 animate-pulse" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter className="text-white">
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
