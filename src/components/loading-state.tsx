import { LoaderIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  tip?: string;
}

export const LoadingState = ({ title, description, tip }: Props) => {
  return (
    <div className="flex flex-1 items-center justify-center py-8 px-4">
      <div className="flex flex-col items-center justify-center gap-y-6 bg-muted/50 border border-border rounded-2xl p-12 shadow-lg w-full max-w-md text-center animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
          <LoaderIcon className="relative z-10 size-8 animate-spin text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
          {tip && <p className="text-xs text-muted-foreground italic mt-1">{tip}</p>}
        </div>
      </div>
    </div>
  );
};
