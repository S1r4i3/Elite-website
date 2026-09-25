import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, createHmac } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DOCUMENTS_BUCKET } from "@/lib/supabase/config";

/**
 * Document storage.
 *
 *  • Supabase Storage — used automatically when the Supabase keys are set.
 *  • Local disk — good for `npm run dev` and for a VPS with a persistent disk.
 *  • S3-compatible object storage — used automatically when S3_BUCKET is set.
 *    Works with AWS S3, Cloudflare R2, DigitalOcean Spaces, Backblaze B2, Supabase Storage.
 *    Required on Vercel, whose filesystem is wiped on every deploy.
 *
 * Files are always stored privately: nothing is public, downloads go through
 * the authenticated routes in /api/me/* and /api/v1/admin/*.
 */

const useSupabase = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const useS3 = () => Boolean(process.env.S3_BUCKET);
const root = () => path.resolve(process.cwd(), process.env.UPLOAD_DIR || ".data/uploads");

/** Which driver is active — handy for /api/health and the setup checklist. */
export const storageDriver = () => (useSupabase() ? "supabase" : useS3() ? "s3" : "local");

// ---------------------------------------------------------------- local disk

function localPath(key: string) {
  const file = path.resolve(root(), key);
  if (file !== root() && !file.startsWith(root() + path.sep)) throw new Error("Invalid storage key");
  return file;
}

// ------------------------------------------------------------ S3 (SigV4, no SDK)

const sha256hex = (d: Buffer | string) => createHash("sha256").update(d).digest("hex");
const hmac = (key: Buffer | string, data: string) => createHmac("sha256", key).update(data).digest();

function s3Config() {
  const bucket = process.env.S3_BUCKET!;
  const region = process.env.S3_REGION || "us-east-1";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || "";
  if (!accessKeyId || !secretAccessKey) throw new Error("S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY are missing");
  // A custom endpoint (R2, Spaces, Supabase…) uses path-style URLs; AWS uses virtual-hosted style.
  const endpoint = process.env.S3_ENDPOINT?.replace(/\/$/, "");
  const host = endpoint ? new URL(endpoint).host : `${bucket}.s3.${region}.amazonaws.com`;
  const prefix = (process.env.S3_PREFIX || "").replace(/^\/|\/$/g, "");
  return { bucket, region, accessKeyId, secretAccessKey, endpoint, host, pathStyle: Boolean(endpoint), prefix };
}

async function s3Request(method: "PUT" | "GET" | "DELETE", key: string, body?: Buffer) {
  const c = s3Config();
  const objectKey = [c.prefix, key].filter(Boolean).join("/");
  const canonicalUri =
    "/" +
    (c.pathStyle ? `${c.bucket}/${objectKey}` : objectKey)
      .split("/")
      .map((seg) => encodeURIComponent(seg))
      .join("/");

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // 20260101T120000Z
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256hex(body ?? "");

  const headers: Record<string, string> = {
    host: c.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (method === "PUT") headers["content-type"] = "application/octet-stream";

  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((h) => `${h}:${headers[h].trim()}\n`)
    .join("");
  const canonicalRequest = [method, canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const scope = `${dateStamp}/${c.region}/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256hex(canonicalRequest)].join("\n");

  const kDate = hmac(`AWS4${c.secretAccessKey}`, dateStamp);
  const signature = hmac(hmac(hmac(hmac(kDate, c.region), "s3"), "aws4_request"), stringToSign).toString("hex");

  headers.authorization = `AWS4-HMAC-SHA256 Credential=${c.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`https://${c.host}${canonicalUri}`, { method, headers, body: body ? new Uint8Array(body) : undefined, cache: "no-store" });
  if (!res.ok) throw new Error(`S3 ${method} failed (${res.status}): ${(await res.text().catch(() => "")).slice(0, 300)}`);
  return res;
}

// ---------------------------------------------------------------- public API

export async function saveObject(key: string, data: Buffer, contentType?: string) {
  if (useSupabase()) {
    const { error } = await supabaseAdmin()
      .storage.from(DOCUMENTS_BUCKET)
      .upload(key, data, { contentType: contentType || "application/octet-stream", upsert: true });
    if (error) throw new Error(`Supabase Storage upload failed: ${error.message}`);
    return key;
  }
  if (useS3()) {
    await s3Request("PUT", key, data);
    return key;
  }
  const file = localPath(key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data, { mode: 0o600 });
  return key;
}

export async function readObject(key: string): Promise<Buffer> {
  if (useSupabase()) {
    const { data, error } = await supabaseAdmin().storage.from(DOCUMENTS_BUCKET).download(key);
    if (error || !data) throw new Error(`Supabase Storage download failed: ${error?.message ?? "not found"}`);
    return Buffer.from(await data.arrayBuffer());
  }
  if (useS3()) {
    const res = await s3Request("GET", key);
    return Buffer.from(await res.arrayBuffer());
  }
  return fs.readFile(localPath(key));
}

export async function deleteObject(key: string) {
  if (useSupabase()) {
    const { error } = await supabaseAdmin().storage.from(DOCUMENTS_BUCKET).remove([key]);
    if (error) throw new Error(`Supabase Storage delete failed: ${error.message}`);
    return;
  }
  if (useS3()) {
    await s3Request("DELETE", key);
    return;
  }
  await fs.rm(localPath(key), { force: true });
}
