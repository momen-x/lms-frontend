"use client";

import { useAskLessonAssistant } from "../hooks/useAskLessonAssistant";
import { useGetLessonAssistantHistory } from "../hooks/useGetLessonAssistantHistory";

import { AiAssistant } from "./ai-assistant";

type AiLessonAssistantSidebarProps = {
  lessonId: string;
  onClose?: () => void;
};

export function AiLessonAssistantSidebar({
  lessonId,
  onClose,
}: AiLessonAssistantSidebarProps) {
  const {
    data: messages = [],
    isPending: isHistoryPending,
    isError: isHistoryError,
    error: historyError,
  } = useGetLessonAssistantHistory(lessonId);

  const { mutateAsync: askLessonAssistant, isPending: isAsking } =
    useAskLessonAssistant();

  return (
    <AiAssistant
      title="AI Lesson Assistant"
      description="Ask questions about this lesson."
      historyText="Your conversation history is saved for this lesson."
      placeholder="Ask a question about this lesson..."
      messageHistory={messages}
      isHistoryPending={isHistoryPending}
      isHistoryError={isHistoryError}
      historyError={historyError}
      isAsking={isAsking}
      onClose={onClose}
      onAsk={(question) =>
        askLessonAssistant({
          lessonId,
          dto: {
            question,
          },
        }).then(() => undefined)
      }
    />
  );
}
