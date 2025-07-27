"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { cn, formatDuration } from "@/lib/utils";
import { format } from "date-fns";



const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-yellow-100 text-yellow-700",
  active: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  processing: "bg-gray-100 text-gray-700",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting",
    cell: ({ row }) => {
      const agentName = row.original.agent?.name ?? "Unknown Agent";
      const startDate = row.original.startedAt
        ? format(row.original.startedAt, "MMM d")
        : "";

      return (
        <div className="flex flex-col gap-y-1">
          <span className="font-semibold capitalize truncate">
            {row.original.name}
          </span>

          <div className="flex items-center gap-x-2">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[180px] truncate capitalize">
              {agentName}
            </span>
            <GeneratedAvatar variant="botttsNeutral" seed={agentName} />
            {startDate && (
              <span className="text-sm text-muted-foreground">{startDate}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusIconMap;
      const Icon = statusIconMap[status];
      const colorClass = statusColorMap[status];

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize flex items-center gap-x-2 px-2 py-1 text-sm",
            colorClass
          )}
        >
          <Icon
            className={cn("size-4", status === "processing" && "animate-spin")}
          />
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize flex items-center gap-x-2 px-2 py-1 text-sm"
      >
        <ClockFadingIcon className="text-blue-700 size-4" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : "Not Available"}
      </Badge>
    ),
  },
];
