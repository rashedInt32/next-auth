import { ConfirmEmail } from "@/components/auth/confirm-email";
import { Suspense } from "react";
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmail />
    </Suspense>
  );
}
