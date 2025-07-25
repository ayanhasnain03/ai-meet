"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftIcon, SearchIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();

  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background">
        <div className="flex items-center gap-2">
          <Button
            className="size-9 p-0"
            variant="outline"
            onClick={toggleSidebar}
          >
            {state === "collapsed" || isMobile ? (
              <PanelLeftIcon className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen((open) => !open)}
          className="flex items-center h-9 w-full max-w-xs justify-start gap-2 text-muted-foreground hover:text-foreground sm:w-[240px]"
        >
          <SearchIcon className="size-4" />
          <span className="text-sm">Search</span>

          <kbd className="ml-auto hidden sm:flex pointer-events-none h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>
            <span className="text-xs">K</span>
          </kbd>
        </Button>
      </nav>
    </>
  );
};
