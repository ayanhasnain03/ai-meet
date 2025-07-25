import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRightIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

interface Props {
  agentId: string;
  agentName: string;
  onEdit: () => void;
  onRemove: () => void;
}

export function AgentViewIdHeader({
  agentId,
  agentName,
  onEdit,
  onRemove,
}: Props) {
  return (
    <header className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">

        <Breadcrumb className="flex-1">
          <BreadcrumbList className="flex items-center space-x-1 text-sm text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="hover:text-primary">
                <Link href="/agents">My Agents</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="font-medium hover:underline text-black">
                <Link href={`/agents/${agentId}`}>{agentName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2">
              <MoreVerticalIcon className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="flex items-center space-x-2" onClick={onEdit}>
              <PencilIcon className="w-4 h-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center space-x-2 text-destructive" onClick={onRemove}>
              <TrashIcon className="w-4 h-4" />
              <span>Remove</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
