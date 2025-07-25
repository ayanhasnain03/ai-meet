import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useMeetingsFIlters } from "../../hooks/use-meetings-filters";
import { CommandSelect } from "@/components/command-select";

export const AgentIdFilter = ()=>{
    const [filters,setFilters] = useMeetingsFIlters();

    const trpc = useTRPC();
    const [agentSearch,setAgentSearch] = useState("");

    const {data} = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize:100,
            search:agentSearch
        })
    )

return (
    <CommandSelect
    className="h-9"
    placeholder="Agent"
    options={(data?.items ?? []).map((agent)=>({
        id:agent.id,
        value:agent.id,
        children: (
            <div className="flex items-center gap-x-2">
                <GeneratedAvatar
                seed={agent.name}
                variant="botttsNeutral"
                />
                {agent.name}
            </div>
        )
    }))}
    onSelect={(value)=>setFilters({agentId:value})}
    onSearch={setAgentSearch}
    value={filters.agentId ?? ""}
    />
)
}
