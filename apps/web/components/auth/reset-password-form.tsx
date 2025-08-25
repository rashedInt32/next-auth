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
import {
  resetPasswordSchema,
  ResetPasswordResolver,
} from "@/schema/authSchema";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

export const ResetPasswordForm = () => {
  const [success, setSuccess] = useState(false);

  const form = useForm<resetPasswordSchema>({
    resolver: effectTsResolver(ResetPasswordResolver),
    defaultValues: {
      token: "",
      password: "",
      configmPassword: "",
    },
  });

  const onSubmit = async (data: resetPasswordSchema) => {
    const { token, password, configmPassword } = data;
  };

  const resetForm = () => {
    setSuccess(false);
    form.reset();
  };

  return (
    <CardWrapper
      headerLabel="Enter your email to get reset link"
      backButtonHref="/auth/login"
      backButtonLabel="Go back to Login"
      showSocial={false}
    >
      {!success ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" {...field} hidden />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="configmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={form.formState?.errors?.root?.message} />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="flex flex-col items-center space-y-4 text-center">
          <Mail className="w-12 h-12 text-green-500" />
          <FormSuccess message="We sent you a reset link. Please check your email." />
          <button
            onClick={resetForm}
            className="text-sm text-blue-500 hover:underline"
          >
            Resend email
          </button>
        </div>
      )}
    </CardWrapper>
  );
};
