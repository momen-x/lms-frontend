"use client";

import {
  Award,
  BadgeCheck,
  CalendarDays,
  Hash,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import QueryErrorState from "@/components/sharing/query-error-state";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";

import { useGetPublicCertificateByNumber } from "../hooks/useGetPublicCertificateByNumber";
import transformingTheDateToATextString from "@/utils/from-date-to-string";

type PublicCertificateVerificationProps = {
  certificateNumber: string;
};

export default function PublicCertificateVerification({
  certificateNumber,
}: PublicCertificateVerificationProps) {
  const {
    data: certificate,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetPublicCertificateByNumber(certificateNumber);
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <CardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <QueryErrorState
          title="Certificate not found"
          description="This certificate could not be verified."
          isRetrying={isFetching}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
            <Award className="size-7 text-muted-foreground" />
          </div>

          <h1 className="mt-4 text-xl font-semibold">Certificate not found</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            We could not find a certificate with this number.
          </p>
        </div>
      </div>
    );
  }

  const issueDate = transformingTheDateToATextString(certificate.issueDate);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-start gap-3 rounded-2xl border bg-card p-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">Verified Certificate</h1>

              <BadgeCheck className="size-5 text-primary" />
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              This certificate was issued by LMS and is valid.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#f8f5ed] p-3 text-[#191919] shadow-xl">
          <div className="border-2 border-[#b89b5e] p-2">
            <div className="border border-[#b89b5e]/70 px-8 py-12 sm:px-12 lg:px-20 lg:py-16">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-full border border-[#b89b5e]">
                  <Award className="size-8" />
                </div>

                <p className="mt-6 text-sm font-medium uppercase tracking-[0.35em] text-[#7b6740]">
                  Certificate of Completion
                </p>

                <div className="mt-6 h-px w-24 bg-[#b89b5e]" />

                <p className="mt-8 text-sm text-[#6e6a61]">
                  This certificate is proudly presented to
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {certificate.student.name ?? "Student"}
                </h2>

                <p className="mt-7 text-sm text-[#6e6a61]">
                  for successfully completing all requirements of
                </p>

                <h3 className="mt-3 max-w-3xl text-2xl font-bold sm:text-3xl">
                  {certificate.course.title}
                </h3>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-[#706b61]">
                  This certificate recognizes the successful completion of the
                  course requirements and achievement of the required learning
                  outcomes.
                </p>

                <div className="mt-10 grid w-full gap-6 border-y border-[#b89b5e]/40 py-6 sm:grid-cols-3">
                  <CertificateMeta
                    icon={<UserRound className="size-4" />}
                    label="Instructor"
                    value={
                      certificate.course.instructor?.name ?? "LMS Instructor"
                    }
                  />

                  <CertificateMeta
                    icon={<CalendarDays className="size-4" />}
                    label="Issued"
                    value={issueDate}
                  />

                  <CertificateMeta
                    icon={<Hash className="size-4" />}
                    label="Certificate No."
                    value={certificate.certificateNumber}
                  />
                </div>

                <div className="mt-12 grid w-full gap-10 sm:grid-cols-2">
                  <Signature
                    name={certificate.course.instructor?.name ?? "Instructor"}
                    label="Instructor"
                  />

                  <Signature name="LMS" label="Authorized by" />
                </div>

                <p className="mt-10 text-xs text-[#8a8478]">
                  This certificate has been publicly verified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CertificateMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#84765b]">
        {icon}
        {label}
      </div>

      <p className="mt-2 max-w-full wrap-break-word text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function Signature({ name, label }: { name: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-medium">{name}</p>

      <div className="mx-auto mt-3 h-px max-w-48 bg-[#72684f]" />

      <p className="mt-2 text-xs text-[#7d776c]">{label}</p>
    </div>
  );
}
