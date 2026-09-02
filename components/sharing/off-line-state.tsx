"use client";
import { WifiOff, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type OfflineStateProps = {
  onRetry?: () => void;
};

export function OfflineState({ onRetry }: OfflineStateProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
          <WifiOff className="size-6 text-muted-foreground" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">You&apos;re offline</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Check your internet connection and try again.
        </p>

        {onRetry && (
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={onRetry}
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
