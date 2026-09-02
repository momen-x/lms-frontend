import type { AskCourseOrLessonAssistantResponse } from "../entities/ai-response";

export type AiChatSource =
  AskCourseOrLessonAssistantResponse["sources"][number];

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  sources?: AiChatSource[];
}
