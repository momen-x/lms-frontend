"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingPage from "@/app/loading";
import { useGetCurrentUser } from "@/app/_modules/user/hooks/useGetCurrentUser";
import { OfflineState } from "@/components/sharing/off-line-state";
import { isNetworkError } from "@/utils/is-network-error";

type GuestGuardProps = {
  children: ReactNode;
  redirectTo?: string;
};

export default function GuestGuard({
  children,
  redirectTo = "/",
}: GuestGuardProps) {
  const router = useRouter();

  const { data: user, isLoading, isError, error, refetch } =
    useGetCurrentUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirectTo);
    }
  }, [isLoading, isError, user, router, redirectTo]);

  if (isLoading) {
    return <LoadingPage />;
  }

  /*
   * A network/server error should not automatically mean
   * that the user is authenticated.
   *
   * You may replace this with a shared error component.
   */
  if (!user && isError && isNetworkError(error)) {
    return <OfflineState onRetry={() => refetch()} />;
  }

  if (!user && isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Unable to verify your session.
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
