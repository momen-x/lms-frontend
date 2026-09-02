"use client";

import {
  CirclePlay,
  Clock3,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  ReceiptText,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Lesson } from "../entity/lesson";
import { useLessonDialog } from "../context/lesson-dialog-context";
import { formatDuration } from "@/utils/format-duration";
import { useMediaDialog } from "../../media/context/media-dialog-context";

interface LessonItemProps {
  lesson: Lesson;
  position: number;
  onView?: string;
  onDelete?: (lesson: Lesson) => void;
}

export default function LessonCard({
  lesson,
  position,
  onView,
  onDelete,
}: LessonItemProps) {
  const { openUpdateLesson } = useLessonDialog();
  const { openCreateMedia } = useMediaDialog();

  return (
    <article className="group relative flex items-center gap-3 rounded-xl border bg-card/60 p-3.5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-md">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
        {position}
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {lesson.title}
          </h4>

          {lesson.isPreview && (
            <Badge
              variant="secondary"
              className="gap-1 border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              <Eye className="size-3" />
              Preview
            </Badge>
          )}
        </div>

        {lesson.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground/80">
            {lesson.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <Clock3 className="size-3.5 text-muted-foreground/70" />
            {formatDuration(lesson.duration)}
          </span>

          <span className="size-1 rounded-full bg-border" />

          <span className="flex items-center gap-1 font-medium">
            <FileText className="size-3.5 text-muted-foreground/70" />
            Lesson {position}
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Media options"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />

        <DropdownMenuContent align="end" className="z-50 w-40">
          <DropdownMenuLinkItem href={onView}>
            <ReceiptText className="mr-2 size-3.5" />
            View
          </DropdownMenuLinkItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => openCreateMedia(lesson.id)}>
            <CirclePlay className="mr-2 size-3.5" />
            Add Media
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              openUpdateLesson(lesson.id);
            }}
          >
            <Pencil className="mr-2 size-3.5" />
            Edit
          </DropdownMenuItem>

          {onDelete && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  onDelete(lesson);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-3.5" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  );
}
