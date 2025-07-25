import Image from "next/image";

interface Props {
  title: string;
  description: string;
  imageUrl?: string;
}

export const EmptyState = ({
  title,
  description,
  imageUrl = "/empty.svg",
}: Props) => {
  return (
    <div
      className="flex items-center justify-center text-center flex-col mx-auto
"
    >
      <Image
        src={imageUrl}
        alt="Empty State"
        height={200}
        width={400}
        className="h-[250px]"
        priority
      />
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
