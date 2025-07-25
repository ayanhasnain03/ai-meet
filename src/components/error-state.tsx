import { AlertTriangle } from "lucide-react";

interface Props {
  title: string;
  description: string;
  retryButton?: React.ReactNode;
}

export const ErrorState = ({ title, description, retryButton }: Props) => {
  return (
    <div className="flex flex-1 items-center justify-center py-8 px-4">
      <div className="flex flex-col items-center justify-center gap-y-6 bg-destructive/10 border border-destructive rounded-2xl p-12 shadow-lg w-full max-w-md text-center animate-fade-in">
        <AlertTriangle className="size-8 text-destructive" />
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-destructive">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {retryButton && <div>{retryButton}</div>}
      </div>
    </div>
  );
};
