import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meetings-form";
import { useRouter } from "next/navigation";

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  open,
  onOpenChange,
}: NewAgentDialogProps) => {
  const router = useRouter();

  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={()=>onOpenChange}
      />
    </ResponsiveDialog>
  );
};
