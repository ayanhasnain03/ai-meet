import JSONL from "jsonl-parse-stringify";
import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

const summarizer = createAgent({
  name: "summarizer",
  system: `
You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
  `.trim(),
  model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY }),
});

export const meetingProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const { meetingId, transcriptUrl } = event.data;

    console.log("➡️ Event received", { transcriptUrl, meetingId });

    const rawTranscript = await step.run("fetch-transcript", async () => {
      const res = await fetch(transcriptUrl);
      const text = await res.text();
      console.log("✅ Transcript fetched. Sample:", text.slice(0, 300));
      return text;
    });

    const transcript = await step.run("parse-transcript", async () => {
      const parsed = JSONL.parse<StreamTranscriptItem>(rawTranscript);
      console.log("✅ Transcript parsed. First items:", parsed.slice(0, 2));
      return parsed;
    });

    const transcriptWithSpeaker = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];
      console.log("👥 Unique speaker IDs:", speakerIds);

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds));
      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds));
      const speakers = [...userSpeakers, ...agentSpeakers];

      const enriched = transcript.map((item) => {
        const speaker = speakers.find((s) => s.id === item.speaker_id);
        return {
          ...item,
          user: {
            name: speaker?.name || "Unknown",
          },
        };
      });

      console.log("✅ Transcript with speakers:", enriched.slice(0, 2));
      return enriched;
    });

    const { output } = await summarizer.run(
      "Summarize the following meeting transcript: " +
        JSON.stringify(transcriptWithSpeaker)
    );

    console.log("🧠 Summarizer output:", output);

    const content = (output[0] as TextMessage).content;
    const summary = typeof content === "string" ? content.trim() : "";

    await step.run("save-summary", async () => {
      console.log("💾 Saving summary:", summary.slice(0, 300));

      await db
        .update(meetings)
        .set({
          summary,
          status: "completed",
        })
        .where(eq(meetings.id, meetingId));

      console.log("✅ Summary saved to DB.");
    });

    console.log("✅ Meeting processing completed successfully.");
  }
);
