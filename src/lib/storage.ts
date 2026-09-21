import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Document storage adapter. Local disk by default; replace `saveObject` / `readObject`
 * with an S3/GCS/Azure implementation for production (keep files private, serve via signed URLs).
 */
const root = () => path.resolve(process.cwd(), process.env.UPLOAD_DIR || ".data/uploads");

export async function saveObject(key: string, data: Buffer) {
  const file = path.join(root(), key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data, { mode: 0o600 });
  return key;
}

export async function readObject(key: string) {
  const file = path.join(root(), key);
  if (!file.startsWith(root())) throw new Error("Invalid key");
  return fs.readFile(file);
}
