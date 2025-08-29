import { VerifyEmail } from "@/components/auth/verify-email";
import { Suspense } from "react";
export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
