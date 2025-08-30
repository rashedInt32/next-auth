"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { CardWrapper } from "./card-wrapper";
import { Loader2, Mail } from "lucide-react";
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
import { authSchema, authResolver } from "@/schema/authSchema";
import { createUserAction } from "@/app/auth/action";

export const RegisterFrom = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const form = useForm<authSchema>({
    resolver: effectTsResolver(authResolver),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: authSchema) => {
    const user = await createUserAction(data);

    if (user?.error) {
      return form.setError("root", { message: user.error });
    }
    setSuccess(true);
    form.reset();
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account? Login"
      showSocial
    >
      {success ? (
        <>
          <Mail className="mx-auto w-12 h-12 text-green-500 mb-6" />
          <FormSuccess message="Registration successful! Please check your email to verify your account." />
        </>
      ) : (
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

            <FormError message={form.formState.errors?.root?.message} />
            <FormSuccess message="" />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Register
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};
