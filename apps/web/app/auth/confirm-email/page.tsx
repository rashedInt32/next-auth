import { ConfirmEmail } from "@/components/auth/confirm-email";
import { Suspense } from "react";
export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmail />
    </Suspense>
  );
}
