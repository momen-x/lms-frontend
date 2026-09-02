"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Quiz } from "../entities/quiz";

import CreateQuiz from "../views/create-quiz";
import UpdateQuiz from "../views/update-quiz";

interface QuizDialogContextValue {
  openCreateQuiz: () => void;
  openUpdateQuiz: (quiz: Quiz) => void;
}

const QuizDialogContext = createContext<QuizDialogContextValue | null>(null);

export function useQuizDialog() {
  const context = useContext(QuizDialogContext);

  if (!context) {
    throw new Error("useQuizDialog must be used within a QuizDialogProvider");
  }

  return context;
}

interface QuizDialogProviderProps {
  children: ReactNode;
  courseId: string;
}

export function QuizDialogProvider({
  children,
  courseId,
}: QuizDialogProviderProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const openCreateQuiz = useCallback(() => {
    setCreateOpen(true);
  }, []);

  const openUpdateQuiz = useCallback((quiz: Quiz) => {
    setActiveQuiz(quiz);
    setUpdateOpen(true);
  }, []);

  const handleCreateOpenChange = useCallback((open: boolean) => {
    setCreateOpen(open);
  }, []);

  const handleUpdateOpenChange = useCallback((open: boolean) => {
    setUpdateOpen(open);

    if (!open) {
      setActiveQuiz(null);
    }
  }, []);

  const contextValue = useMemo<QuizDialogContextValue>(
    () => ({
      openCreateQuiz,
      openUpdateQuiz,
    }),
    [openCreateQuiz, openUpdateQuiz],
  );

  return (
    <QuizDialogContext.Provider value={contextValue}>
      {children}
      <CreateQuiz
        open={createOpen}
        onOpenChange={handleCreateOpenChange}
        courseId={courseId}
      />
      {activeQuiz && (
        <UpdateQuiz
          open={updateOpen}
          onOpenChange={handleUpdateOpenChange}
          quiz={activeQuiz}
        />
      )}
    </QuizDialogContext.Provider>
  );
}
