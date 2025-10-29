"use client";

import { useState } from "react";

export function EmailForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    // TODO: Add your email submission logic here
    // For now, just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setStatus("success");
    setEmail("");

    // Reset status after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-md px-4 sm:px-0"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-Mail für Beta-Anmeldung"
        required
        disabled={isSubmitting}
        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground/60"
      />
      <button
        type="submit"
        disabled={isSubmitting || status === "success"}
        className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium bg-foreground text-background rounded-md hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap"
      >
        {isSubmitting
          ? "Wird angemeldet..."
          : status === "success"
          ? "Angemeldet"
          : "Für Beta anmelden"}
      </button>
    </form>
  );
}
