"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const AgentsView = () => {
  const trpc = useTRPC();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    ...trpc.agents.getMany.queryOptions(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message || "Something went wrong"}</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
