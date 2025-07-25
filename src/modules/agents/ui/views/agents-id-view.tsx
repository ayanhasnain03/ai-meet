"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AgentViewIdHeader } from "./agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog ";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false)
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({
      id: agentId,
    })
  );
  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        router.push("/agents");
      },
      onError:(error)=>{
        toast.error(error.message)
      }
    })
  );

const [RemoveConfirmation,confirmRemove] = useConfirm(
  "Are you sure?",
  `The following action will remove ${data.meetingCount} associated meetings`
)

const handleRemoveAgent = async()=>{
  const ok = await confirmRemove();
if(!ok) return;
await removeAgent.mutateAsync({id:agentId})
}
  return (
  <>
  <RemoveConfirmation/>
  <UpdateAgentDialog open={updateAgentDialogOpen} onOpenChange={setUpdateAgentDialogOpen} initialValues={data}/>
    <div className="flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-6">
      <AgentViewIdHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => setUpdateAgentDialogOpen(true)}
        onRemove={handleRemoveAgent}
      />

      <div className="bg-white rounded-lg border p-6 flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <GeneratedAvatar variant="botttsNeutral" seed={data.name} />
          <h2 className="text-2xl font-semibold">{data.name}</h2>
        </div>

        <Badge
          variant="outline"
          className="w-fit flex items-center gap-x-2 text-sm"
        >
          <VideoIcon className="w-4 h-4 text-blue-700" />
          {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
        </Badge>

        <div className="flex flex-col gap-y-2">
          <p className="text-lg font-medium">Instructions</p>
          <p className="text-neutral-800">{data.instructions}</p>
        </div>
      </div>
    </div>
  </>
  );
};

export const AgentsIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds"
    />
  );
};

export const AgentsIdViewError = () => {
  return (
    <ErrorState
      title="Error loading Agent"
      description="Something went wrong"
    />
  );
};
