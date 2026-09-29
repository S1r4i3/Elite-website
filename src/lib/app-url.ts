import "server-only";

import { emailBaseUrl } from "./site-url";

/** Public base URL used in email links — always the real domain (https://elitebtax.com) in production. */
export function appUrl() {
  return emailBaseUrl();
}
