import React, { useState, useMemo, useCallback, memo } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MeetingGetOne } from "../../types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CommandSelect } from "@/components/command-select";
import debounce from "lodash.debounce";
import { NewAgenDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = memo(function MeetingForm({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const debouncedSearch = useMemo(
    () => debounce((v: string) => setAgentSearch(v), 100),
    []
  );

  const agentsQuery = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  const agentOptions = useMemo(
    () =>
      (agentsQuery.data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={agent.name}
              variant="botttsNeutral"
              className="border"
            />
            <span>{agent.name}</span>
          </div>
        ),
      })),
    [agentsQuery.data?.items]
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        toast.success("Meeting created");
        onSuccess?.(data.id);
      },
      onError: (err) => {
        console.error(err);
        toast.error(err.message);
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id })
          );
        }
        toast.success("Meeting updated");
        onSuccess?.();
      },
      onError: (err) => {
        console.error(err);
        toast.error(err.message);
      },
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = Boolean(initialValues?.id);
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = useCallback(
    (values: z.infer<typeof meetingsInsertSchema>) => {
      if (isEdit && initialValues?.id) {
        updateMeeting.mutate({ ...values, id: initialValues.id });
      } else {
        createMeeting.mutate(values);
      }
    },
    [createMeeting, updateMeeting, isEdit, initialValues?.id]
  );

  return (
    <>
      <NewAgenDialog
        open={openNewAgentDialog}
        onOpenChange={(open) => {
          setOpenNewAgentDialog(open);

        }}
      />

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Math Consultation" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={agentOptions}
                    value={field.value}
                    onSelect={field.onChange}
                    onSearch={debouncedSearch}
                    isSearchable
                    placeholder="Select an Agent"
                  />
                </FormControl>
                <FormDescription className="flex items-center gap-2">
                  Not seeing the right agent?
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    + Create new
                  </Button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button
                variant="ghost"
                type="button"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
});
