"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-limestone flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="heading-h2 mb-6">Something went wrong</h1>
        <p className="body-m text-body-75 mb-8">
          We apologize for the inconvenience. Please try again or return to the
          homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
          <Button href="/" variant="secondary">
            Return home
          </Button>
        </div>
      </div>
    </main>
  );
}
