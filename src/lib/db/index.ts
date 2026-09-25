import "server-only";
import type { Repository } from "./types";
import { FileRepository } from "./file-store";
import { PostgresRepository } from "./postgres-store";
import { SupabaseRepository } from "./supabase-store";
import { serviceRoleConfigured } from "@/lib/supabase/admin";

let repo: Repository | undefined;

/**
 * Picks the data layer:
 *   1. Supabase, when the project URL and service-role key are set  ← production
 *   2. PostgreSQL, when DATABASE_URL is set
 *   3. a local JSON file, for development with nothing configured
 */
export function getRepository(): Repository {
  if (!repo) {
    repo = serviceRoleConfigured()
      ? new SupabaseRepository()
      : process.env.DATABASE_URL
        ? new PostgresRepository()
        : new FileRepository();
  }
  return repo;
}

/** Which backend is live — surfaced by /api/health. */
export function repositoryName() {
  return serviceRoleConfigured() ? "supabase" : process.env.DATABASE_URL ? "postgres" : "file";
}

export * from "./types";
