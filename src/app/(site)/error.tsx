"use client";

import { site } from "@/lib/site";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger-50 text-danger-600">
          <AlertTriangle className="size-7" aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">Something went wrong.</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">Please try again. If the problem continues, call us at {site.phone.display}.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="secondary">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
