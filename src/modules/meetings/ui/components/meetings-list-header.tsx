"use client";

import { useState } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFIlters } from "../../hooks/use-meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFIlters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.status || !!filters.search || !!filters.agentId;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: 1,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="mr-2 size-4" />
            New Meeting
          </Button>
        </div>
        <ScrollArea >

        <div className="flex items-center gap-x-2 p-1">
          <MeetingsSearchFilter />
          <StatusFilter />
          <AgentIdFilter />
          {isAnyFilterModified && (
            <Button variant="outline" onClick={onClearFilters}>
              <XCircleIcon className="mr-2 size-4" />
              Clear
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal"/>
        </ScrollArea>
      </div>
    </>
  );
};
