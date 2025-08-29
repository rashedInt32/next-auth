"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormSuccess } from "@/components/auth/form-success";
import { FormError } from "@/components/auth/form-error";

export const VerifyEmail = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // useEffect(() => {
  //   const onSubmit = async () => {
  //     if (!token) {
  //       setError("Missing token.");
  //       return;
  //     }
  //     const response = await verifyEmailAction(token);
  //     if (response.success) {
  //       setSuccess(response.success);
  //     } else {
  //       setError(response.error);
  //     }
  //   };
  //
  //   onSubmit();
  // }, [token]);

  return (
    <CardWrapper
      headerLabel="Verifying your email..."
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocial={false}
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        {!success && !error && (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-gray-600">Verifying...</p>
          </div>
        )}
        {success && (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <FormSuccess message={success} />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center space-y-4">
            <Mail className="h-12 w-12 text-red-500" />
            <FormError message={error} />
          </div>
        )}
      </div>
    </CardWrapper>
  );
};
