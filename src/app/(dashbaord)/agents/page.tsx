import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
const Page = async () => {
  const queryCleint = getQueryClient();

  void queryCleint.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    //fetch data and save on cache
    <HydrationBoundary state={dehydrate(queryCleint)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
