"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OTPModal from "./OTPModal";

// 1. Definição do Schema do Zod

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(1, "Full name is required").max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setErrorMessage] = React.useState("");
  const [accountId, setAccountId] = React.useState<string | null>(null);

  const formSchema = authFormSchema(type);
  // 2. Inicialização isolada e desestruturada do React Hook Form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  // 3. Função de submissão
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user =
        type === "sign-up"
          ? await createAccount({
              fullName: data.fullName || "",
              email: data.email,
            })
          : await signInUser({ email: data.email });

      if (user && user.accountId) {
        setAccountId(user.accountId);
      } else if (typeof user === "string") {
        const parsed = JSON.parse(user);
        setAccountId(parsed.accountId);
      }
    } catch {
      setErrorMessage("Faild to create account. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <h1 className="form-title">
          {type === "sign-in" ? "Sign In" : "Sign Up"}
        </h1>

        {/* PRIMEIRA CAIXA (Username) */}
        {type === "sign-up" && (
          <Field data-invalid={!!errors.fullName || undefined}>
            <div className="shad-form-item">
              <FieldLabel>Full Name</FieldLabel>

              <Input
                placeholder="Enter your full name"
                className="shad-input"
                {...register("fullName")}
              />
            </div>

            <FieldError className="shad-form-message">
              {errors.fullName?.message}
            </FieldError>
          </Field>
        )}

        {/* SEGUNDA CAIXA DUPLICADA (Apenas o bloco visual igual abaixo) */}
        <Field data-invalid={!!errors.email || undefined}>
          <div className="shad-form-item">
            <FieldLabel>Email</FieldLabel>

            <Input
              placeholder="Enter your email"
              className="shad-input"
              {...register("email")}
            />
          </div>

          <FieldError className="shad-form-message">
            {errors.email?.message}
          </FieldError>
        </Field>

        <Button
          type="submit"
          className="form-submit-button"
          disabled={isLoading}
        >
          {type === "sign-in" ? "Sign In" : "Sign Up"}

          {isLoading && (
            <picture>
              <img
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            </picture>
          )}
        </Button>

        <div className="body-2 flex justify-center">
          <p className="text-light-100">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="ml-1 font-medium text-brand"
          >
            {" "}
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </div>
      </form>
      {/* OTP Verification */}

      {accountId && (
        <OTPModal
          email={getValues("email")}
          fullName={getValues("fullName") || undefined}
          accountId={accountId}
        />
      )}
    </>
  );
};

export default AuthForm;
