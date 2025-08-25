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
import { Loader2 } from "lucide-react";

export const ResetPasswordForm = () => {
  const form = useForm<resetPasswordSchema>({
    resolver: effectTsResolver(ResetPasswordResolver),
    defaultValues: {
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: resetPasswordSchema) => {
    const { token, password, confirmPassword } = data;
  };

  const resetForm = () => {
    form.reset();
  };

  return (
    <CardWrapper
      headerLabel="Enter your new password"
      backButtonHref="/auth/login"
      backButtonLabel="Go back to Login"
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem className="h-0 m-0">
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
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="********" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="********" />
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
    </CardWrapper>
  );
};
