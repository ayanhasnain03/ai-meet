"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AgentsView = () => {
  const trpc = useTRPC();
  // get  data from cache
  const { data } = useSuspenseQuery({
    ...trpc.agents.getMany.queryOptions(),
  });

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState title="Error loading " description="Something went wrong" />
  );
};
