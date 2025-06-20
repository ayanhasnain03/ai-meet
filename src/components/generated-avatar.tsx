import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
  seed,
  className,
  variant,
}: GeneratedAvatarProps) => {
  const avatar = useMemo(() => {
    const options = variant === "initials"
      ? { seed, fontWeight: 500, fontSize: 42 }
      : { seed };

    return createAvatar(
      variant === "botttsNeutral" ? botttsNeutral : initials,
      options
    );
  }, [seed, variant]);

  return (
    <Avatar className={`${className ? className : "w-10 h-10"} `}>
      <AvatarImage src={avatar.toDataUri()} alt="Generated Avatar" />
      <AvatarFallback>{seed.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
};
