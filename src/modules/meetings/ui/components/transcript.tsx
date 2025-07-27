import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generatedAvatarUri } from "@/lib/avatar";
import Highlighter from "react-highlight-words";
import { format } from "date-fns";

interface Props {
  meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
  const trpc = useTRPC();

  const { data = [], isLoading } = useQuery(
    trpc.meetings.getTranscript.queryOptions({ id: meetingId })
  );

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return data.filter((item) => item.text.toLowerCase().includes(query));
  }, [searchQuery, data]);

  return (
    <div className="bg-white rounded-lg border px-4 py-5 flex flex-col gap-y-4 w-full">
      <p className="text-sm font-medium">Transcript</p>

      <div className="relative">
        <Input
          placeholder="Search Transcript"
          className="pl-8 h-9 w-full max-w-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading transcript...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No transcript found.</p>
      ) : (
        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-y-4">
            {filteredData.map((item) => (
              <TranscriptItem key={item.start_ts} item={item} searchQuery={searchQuery} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

interface TranscriptItemProps {
  item: {
    start_ts: number;
    text: string;
    user: {
      name: string;
      image?: string | null;
    };
  };
  searchQuery: string;
}

const TranscriptItem = ({ item, searchQuery }: TranscriptItemProps) => {
  const avatarSrc =
    item.user.image ??
    generatedAvatarUri({
      seed: item.user.name,
      variant: "initials",
    });

  const timestamp = format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), "mm:ss");

  return (
    <div className="flex flex-col gap-y-2 hover:bg-muted p-4 rounded-md border">
      <div className="flex gap-x-2 items-center">
        <Avatar className="size-4">
          <AvatarImage src={avatarSrc} alt="user-avatar" />
        </Avatar>
        <p className="text-sm font-medium">{item.user.name}</p>
        <p className="text-sm text-blue-500 font-medium">{timestamp}</p>
      </div>
      <Highlighter
        highlightClassName="bg-yellow-200"
        searchWords={[searchQuery]}
        autoEscape
        textToHighlight={item.text}
      />
    </div>
  );
};
