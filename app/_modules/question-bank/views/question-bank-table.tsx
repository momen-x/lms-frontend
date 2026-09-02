"use client";

import { useMemo, useState } from "react";
import { MoreVertical, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import QueryErrorState from "@/components/sharing/query-error-state";
import transformingTheDateToATextString from "@/utils/from-date-to-string";

import { useGetCourseQuestionBank } from "../hooks/useGetCourseQuestionBank";
import { useDeleteQuestionBank } from "../hooks/useDeleteQuestionBank";
import { useQuestionsBankDialog } from "../context/question-bank-dialog-context";
import { getErrorMessage } from "@/utils/get-axios-error-message";
import { toast } from "react-toastify";
import BackBtn from "@/components/sharing/back-btn";

interface QuestionBanksTableProps {
  courseId: string;
}

export default function QuestionBanksTable({
  courseId,
}: QuestionBanksTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: questionBanks = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetCourseQuestionBank(courseId);

  const { mutateAsync: deleteQuestionBank } = useDeleteQuestionBank();

  const { openCreateQuestionsBank, openUpdateQuestionsBank } =
    useQuestionsBankDialog();

  const filteredQuestionBanks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return questionBanks;
    }

    return questionBanks.filter(({ questionsBank }) =>
      questionsBank.title.toLowerCase().includes(query),
    );
  }, [questionBanks, searchQuery]);

  const totalQuestionCount = useMemo(
    () => questionBanks.reduce((total, bank) => total + bank.questionCount, 0),
    [questionBanks],
  );

  const handleDelete = async (questionsBankId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question bank?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteQuestionBank({
        questionsBankId,
        courseId,
      });
    } catch (error) {
      const errMessage = getErrorMessage(error);
      toast.error(
        errMessage ?? "Something went wrong, failed to delete question bank",
      );
      // You can add toast here
    }
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <QueryErrorState
        title="Failed to load question banks"
        description="We couldn’t load the question banks. Please try again."
        isRetrying={isFetching}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-background p-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Question Banks</h1>

          <p className="text-sm text-muted-foreground">
            {questionBanks.length} question banks with {totalQuestionCount}{" "}
            questions in total.
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <BackBtn />

          <Button
            size="sm"
            className="gap-2"
            onClick={() => openCreateQuestionsBank(courseId)}
          >
            <Plus className="h-4 w-4" />
            Create Question Bank
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search question banks..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="bg-background pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Title</TableHead>

              <TableHead className="font-semibold">Questions</TableHead>

              <TableHead className="font-semibold">Created</TableHead>

              <TableHead className="font-semibold">Updated</TableHead>

              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredQuestionBanks.length > 0 ? (
              filteredQuestionBanks.map(({ questionsBank, questionCount }) => (
                <TableRow
                  key={questionsBank.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    {questionsBank.title}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {questionCount}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {transformingTheDateToATextString(questionsBank.createdAt)}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {transformingTheDateToATextString(questionsBank.updatedAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          />
                        }
                      >
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLinkItem
                          href={`/instructor-dashboard/courses/${courseId}/question-banks/${questionsBank.id}/questions`}
                        >
                          Manage Questions
                        </DropdownMenuLinkItem>

                        <DropdownMenuItem
                          onClick={() => {
                           
                            openUpdateQuestionsBank(questionsBank);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(questionsBank.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  {searchQuery
                    ? "No question banks match your search."
                    : "No question banks found. Create your first question bank."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
