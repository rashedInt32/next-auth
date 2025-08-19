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
import { createUserAction } from "@/app/auth/action";

export const RegisterFrom = () => {
  const form = useForm<Omit<authSchema, "password">>({
    resolver: effectTsResolver(passwordResetResolver),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: Omit<authSchema, "password">) => {
    const { email } = data;
    if (!email) {
      return;
    }
    const user = await createUserAction(data);
    console.log("User creation response:", user);
  };

  return (
    <CardWrapper
      headerLabel="Enter you email to get reset link"
      backButtonHref="/auth/login"
      backButtonLabel="Go back to Login"
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

          <FormError message="" />
          <FormSuccess message="" />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
