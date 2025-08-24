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
import { authSchema, passwordResetResolver } from "@/schema/loginSchema";
import { generateResetPasswordTokenAction } from "@/app/auth/action";

export const PasswordResetFrom = () => {
  const form = useForm<Omit<authSchema, "password">>({
    resolver: effectTsResolver(passwordResetResolver),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: Omit<authSchema, "password">) => {
    const { email } = data;
    const token = await generateResetPasswordTokenAction({ email });
    if (token?.error && token?.error !== undefined) {
      form.setError("root", { message: token?.error });
    }
    console.log("token", token);
  };

  return (
    <CardWrapper
      headerLabel="Enter you email to get reset link"
      backButtonHref="/auth/login"
      backButtonLabel="Go back to Login"
      showSocial={false}
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

          <FormError message={form.formState?.errors?.root?.message} />
          <FormSuccess message="" />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
