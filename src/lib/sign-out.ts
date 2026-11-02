import { apiFetch } from "./api-client";
import { toast } from "@/components/ui/toaster";

/** Ends the session. Returns false (and tells the visitor) if the server couldn't be reached — they stay signed in. */
export async function signOut(): Promise<boolean> {
  try {
    const res = await apiFetch("/api/auth/logout", { method: "POST" }, 10_000);
    if (!res.ok) throw new Error("Couldn't sign you out. Please try again.");
    toast.success("You're signed out.");
    return true;
  } catch (e) {
    toast.error((e as Error).message || "Couldn't sign you out. Please try again.");
    return false;
  }
}
