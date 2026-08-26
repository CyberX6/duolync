import { Suspense } from "react";
import Auth from "@/pages/Auth";

export default function SignInPage() {
  return (
    <Suspense>
      <Auth />
    </Suspense>
  );
}
