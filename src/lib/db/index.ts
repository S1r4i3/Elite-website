import "server-only";
import type { Repository } from "./types";
import { FileRepository } from "./file-store";
import { PostgresRepository } from "./postgres-store";

let repo: Repository | undefined;

/** Returns PostgreSQL when DATABASE_URL is set, otherwise a local file store. */
export function getRepository(): Repository {
  if (!repo) repo = process.env.DATABASE_URL ? new PostgresRepository() : new FileRepository();
  return repo;
}

export * from "./types";
