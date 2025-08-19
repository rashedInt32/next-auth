"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "./form-error";
import { authSchema, authResolver } from "@/schema/loginSchema";
import { Effect } from "effect";
import { loginEffect } from "@/auth";
import { UserError } from "@repo/auth/error";

export const LoginForm = () => {
  const rotuer = useRouter();
  const form = useForm<authSchema>({
    resolver: effectTsResolver(authResolver),
    defaultValues: {
      email: "admin@admin.com",
      password: "Pwd1234!",
    },
  });

  const onSubmit = async (data: authSchema) => {
    const { email, password } = data;

    const program = loginEffect(email, password, rotuer).pipe(
      Effect.tapError((e: UserError) =>
        Effect.sync(() => form.setError("root", { message: e.message })),
      ),
      Effect.asVoid,
    );
    await Effect.runPromise(program);
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account? Register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  Password{" "}
                  <Link
                    className="text-blue-500 text-[12px] underline"
                    href="/password-reset"
                  >
                    Forgot Password
                  </Link>
                </FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={form.formState.errors?.root?.message} />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
