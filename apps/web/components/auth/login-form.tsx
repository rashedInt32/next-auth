"use client";
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
import { FormSuccess } from "./form-success";
import { authSchema, authResolver } from "@/schema/loginSchema";
import { signIn } from "@/auth";

export const LoginForm = () => {
  const form = useForm<authSchema>({
    resolver: effectTsResolver(authResolver),
    defaultValues: {
      email: "admin@admin.com",
      password: "Pwd1234!",
    },
  });

  const onSubmit = async (data: authSchema) => {
    const { email, password } = data;

    if (!email || !password) {
      form.setError("root", { message: "Email and password are required." });
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const errorMessage =
          result.error === "CredentialsSignin"
            ? "Invalid email or password."
            : result.error || "An unexpected error occurred.";
        form.setError("root", { message: errorMessage });
        return;
      }

      window.location.href = "/dashboard"; // Or use Next.js router
    } catch (error) {
      form.setError("root", { message: "An unexpected error occurred." });
    }
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message="" />
          <pre>{JSON.stringify(form.formState.errors)}</pre>
          <FormSuccess message="" />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
