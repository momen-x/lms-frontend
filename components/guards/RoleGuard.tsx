"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingPage from "@/app/loading";
import { useGetCurrentUser } from "@/app/_modules/user/hooks/useGetCurrentUser";
import type { UserRole } from "@/app/_modules/user/entity/user";
import { OfflineState } from "@/components/sharing/off-line-state";
import { isNetworkError } from "@/utils/is-network-error";

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: readonly UserRole[];
  unauthorizedRedirectTo?: string;
};

export default function RoleGuard({
  children,
  allowedRoles,
  unauthorizedRedirectTo = "/",
}: RoleGuardProps) {
  const router = useRouter();

  const { data: user, isLoading, isError, error, refetch } =
    useGetCurrentUser();

  const isAuthorized = Boolean(user && allowedRoles.includes(user.role));

  useEffect(() => {
    if (isLoading || (!user && isError)) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(unauthorizedRedirectTo);
    }
  }, [isLoading, isError, user, allowedRoles, unauthorizedRedirectTo, router]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user && isError && isNetworkError(error)) {
    return <OfflineState onRetry={() => refetch()} />;
  }

  if (!user && isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Unable to verify your permissions.
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
// import type { UserRole } from "@/app/_modules/user/entity/user";

// const ADMIN_ROLES = ["admin"] satisfies readonly UserRole[];
