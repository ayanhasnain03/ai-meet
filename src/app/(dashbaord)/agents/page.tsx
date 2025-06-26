import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if(!session) redirect("/sign-in")



  const queryCleint = getQueryClient();

  void queryCleint.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
   <>
   <AgentsListHeader/>
    <HydrationBoundary state={dehydrate(queryCleint)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
   </>
  );
};

export default Page;
