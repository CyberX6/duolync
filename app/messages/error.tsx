"use client";

import { useEffect } from "react";
import { TriangleAlert, RotateCcw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Messages] Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <TriangleAlert className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold mb-2">Messages failed to load</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {error.message || "There was a problem loading your messages."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Try again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"} className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
