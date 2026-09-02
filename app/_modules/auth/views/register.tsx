/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

import ValidationInput from "@/components/inputs/validation-input";
import { registerFields as fields } from "./fields";

import registerImage from "@/public/assets/register.png";
import LoginByGoogleOrGithub from "./login-by-google-or-github";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { RegisterData, registerSchema, TRegisterForm } from "../dto/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../hooks/useRegister";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/get-axios-error-message";
import { CardContent, CardFooter } from "@/components/ui/card";
import ValidationCheckbox from "@/components/inputs/validation-checkbox";
import { AUTH_ROUTES } from "../utils/constants";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAgree: false,
    },
    mode: "onBlur",
  });
  const { mutate: submitRegister, isPending } = useRegister();

  const onSubmit = async ({
    name,
    email,
    password,
    isAgree,
  }: TRegisterForm) => {
    if (!isAgree) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    submitRegister(
      { name, email, password },
      {
        onSuccess: () => {
          toast.success("Check your email. and verification it to continue");
          router.push(
            `${AUTH_ROUTES.checkYourEmail}?email=${encodeURIComponent(email)}&verify=true`,
          );
          router.refresh();
        },
        onError: (error) => {
          console.error("Registration failed:", error);
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage ?? "Registration failed. Please try again.");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-xl md:grid-cols-2">
        <div className="flex flex-col justify-between p-8 sm:p-12 md:p-10 lg:p-12">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-sky-600 dark:text-sky-500">
              <GraduationCap className="h-5 w-5 default" />
            </div>
            <span className="text-xl font-bold tracking-tight">LMS</span>
          </div>

          <div className="my-auto py-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Join thousands of learners and instructors{" "}
            </p>

            <FormProvider {...form}>
              <form
                id="register-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <CardContent>
                  {fields.map(({ name, title, placeholder, Icon, type }) => (
                    <div key={name} className="space-y-3 mt-5 mb-5">
                      <ValidationInput<RegisterData>
                        fieldTitle={
                          <>
                            <span className="text-muted-foreground">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-gray-700 dark:text-gray-200">
                              {title}
                            </span>
                          </>
                        }
                        nameInSchema={name as keyof RegisterData}
                        placeholder={placeholder}
                        className="h-10 rounded-xl"
                        type={type}
                      />
                    </div>
                  ))}
                  <ValidationCheckbox<RegisterData>
                    nameInSchema="isAgree"
                    message={
                      <>
                        I agree to the{" "}
                        <Link
                          href={AUTH_ROUTES.terms}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href={AUTH_ROUTES.privacy}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Privacy Policy
                        </Link>
                      </>
                    }
                    className="mb-8"
                    disabled={isPending}
                  />
                </CardContent>
              </form>
              <CardFooter className="flex-col gap-2">
                <Button
                  type="submit"
                  form="register-form"
                  disabled={isPending || !form.formState.isValid}
                  className="mt-2 h-10 w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 font-medium"
                >
                  Sign up
                </Button>
              </CardFooter>
            </FormProvider>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={AUTH_ROUTES.login}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign in
              </Link>
            </div>

            <div className="relative my-6 flex w-full items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-xs text-muted-foreground/60">
                or continue with
              </span>
            </div>

            <LoginByGoogleOrGithub />
          </div>
        </div>

        <div className="relative hidden md:flex flex-col justify-between p-12 ">
          <Image
            src={registerImage}
            alt="Person studying on their laptop"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 0vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
