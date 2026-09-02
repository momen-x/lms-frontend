"use client";

import { useAskCourseAssistant } from "../hooks/useAskCourseAssistant";
import { useGetCourseAssistantHistory } from "../hooks/useGetCourseAssistantHistory";

import { AiAssistant } from "./ai-assistant";

type AiCourseAssistantSidebarProps = {
  courseId: string;
  onClose?: () => void;
};

export function AiCourseAssistantSidebar({
  courseId,
  onClose,
}: AiCourseAssistantSidebarProps) {
  const {
    data: messages = [],
    isPending: isHistoryPending,
    isError: isHistoryError,
    error: historyError,
  } = useGetCourseAssistantHistory(courseId);

  const { mutateAsync: askCourseAssistant, isPending: isAsking } =
    useAskCourseAssistant();

  return (
    <AiAssistant
      title="AI Course Assistant"
      description="Ask questions about this course."
      historyText="Your conversation history is saved for this course."
      placeholder="Ask a question about this course..."
      messageHistory={messages}
      isHistoryPending={isHistoryPending}
      isHistoryError={isHistoryError}
      historyError={historyError}
      isAsking={isAsking}
      onClose={onClose}
      onAsk={(question) =>
        askCourseAssistant({
          courseId,
          dto: {
            question,
          },
        }).then(() => undefined)
      }
    />
  );
}
