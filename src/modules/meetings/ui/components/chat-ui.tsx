import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Channel } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel as ChannelComponent,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css"; // Stream styling

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";

interface ChatUIProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage?: string;
}

export const ChatUI = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: ChatUIProps) => {
  const trpc = useTRPC();

  const { mutateAsync: generateChatToken } = useMutation(
    trpc.meetings.generateChatToken.mutationOptions()
  );

  const [channel, setChannel] = useState<Channel | null>(null);

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    tokenOrProvider: generateChatToken,
    userData: {
      id: userId,
      name: userName,
      image: userImage,
    },
  });

  useEffect(() => {
    if (!client) return;

    const setupChannel = async () => {
      const newChannel = client.channel("messaging", meetingId, {
        members: [userId],
      });

      await newChannel.watch();
      setChannel(newChannel);
    };

    setupChannel();
  }, [client, meetingId, meetingName, userId]);

  if (!client || !channel) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingState
          title="Loading chat"
          description="Please wait while we connect you..."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Chat client={client} theme="str-chat__theme-light">
        <ChannelComponent channel={channel}>
          <Window>
            <div className="p-4 border-b bg-muted text-sm font-medium">
              Chat — {meetingName}
            </div>
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
            <MessageList />

            </div>
            <MessageInput />
          </Window>
          <Thread />
        </ChannelComponent>
      </Chat>
    </div>
  );
};
