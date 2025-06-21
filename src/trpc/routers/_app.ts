<<<<<<< HEAD
import { z } from "zod";
import { createTRPCRouter } from "../init";
import { agentsRouter } from "@/modules/agents/server/procedures";
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
=======
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
>>>>>>> aa6e2284f120ee238bd5f88c7a431a69ab3bec7d
});
// export type definition of API
export type AppRouter = typeof appRouter;
