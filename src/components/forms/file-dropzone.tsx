"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Camera, CheckCircle2, FileText, Lock, RotateCcw, UploadCloud, X, AlertCircle } from "lucide-react";
import { UPLOAD_LIMITS, acceptedExtensions, acceptedLabel } from "@/lib/validation/upload";
import { cn, formatBytes } from "@/lib/utils";

export type UploadItem = {
  key: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  id?: string;
  error?: string;
};

type Props = {
  category?: string;
  onChange?: (ids: string[], items: UploadItem[]) => void;
  onBusyChange?: (busy: boolean) => void;
  compact?: boolean;
  label?: string;
  /** Upload endpoint (default: public lead uploads). */
  endpoint?: string;
  /** Extra form fields sent with every file (e.g. taxYear). */
  extraFields?: Record<string, string>;
  /** Called after each successful upload. */
  onUploaded?: (id: string) => void;
};

/** PUT a file to a Supabase signed upload URL, with progress. */
function putToStorage(url: string, file: File, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const body = new FormData();
    body.append("cacheControl", "3600");
    body.append("", file);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed — please try again")));
    xhr.onerror = () => reject(new Error("Network error — check your connection"));
    xhr.send(body);
  });
}

/**
 * Client portal uploads go straight to storage (works for files up to 15 MB on Vercel, whose
 * functions reject bodies over ~4.5 MB). Falls back to the classic upload when that isn't available.
 */
async function uploadFile(file: File, category: string, onProgress: (p: number) => void, endpoint = "/api/uploads", extra: Record<string, string> = {}) {
  if (endpoint === "/api/me/documents") {
    const sign = await fetch("/api/me/documents/sign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: file.name, size: file.size }),
    });
    const s = await sign.json().catch(() => ({}));
    if (sign.ok && s.ok) {
      await putToStorage(s.signedUrl, file, onProgress);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: s.key, name: file.name, category, ...extra }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Upload failed");
      return { id: String(json.id) };
    }
    if (sign.status !== 501) throw new Error(s.error || "Upload failed");
  }
  return uploadViaApi(file, category, onProgress, endpoint, extra);
}

function uploadViaApi(file: File, category: string, onProgress: (p: number) => void, endpoint = "/api/uploads", extra: Record<string, string> = {}) {
  return new Promise<{ id: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const body = new FormData();
    body.append("file", file);
    body.append("category", category);
    for (const [k, v] of Object.entries(extra)) body.append(k, v);
    xhr.open("POST", endpoint);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && json.ok) resolve({ id: json.id });
        else reject(new Error(json.error || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error — check your connection"));
    xhr.send(body);
  });
}

export function FileDropzone({ category = "other", onChange, onBusyChange, compact = false, label = "Upload documents", endpoint, extraFields, onUploaded }: Props) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const descId = useId();

  useEffect(() => {
    onChange?.(items.filter((i) => i.status === "done" && i.id).map((i) => i.id!), items);
    onBusyChange?.(items.some((i) => i.status === "uploading"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const update = (key: string, patch: Partial<UploadItem>) =>
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));

  const start = useCallback(
    (item: UploadItem) => {
      uploadFile(item.file, category, (p) => update(item.key, { progress: p }), endpoint, extraFields)
        .then(({ id }) => {
          update(item.key, { status: "done", progress: 100, id });
          onUploaded?.(id);
        })
        .catch((e: Error) => update(item.key, { status: "error", error: e.message }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, endpoint, JSON.stringify(extraFields)],
  );

  const addFiles = (list: FileList | File[]) => {
    setNotice(null);
    const files = Array.from(list);
    const room = UPLOAD_LIMITS.maxFiles - items.length;
    if (room <= 0) {
      setNotice(`You can upload up to ${UPLOAD_LIMITS.maxFiles} files.`);
      return;
    }
    const next: UploadItem[] = [];
    for (const file of files.slice(0, room)) {
      const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const key = `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`;
      if (!acceptedExtensions.includes(ext)) {
        next.push({ key, file, progress: 0, status: "error", error: "Unsupported file type" });
      } else if (file.size > UPLOAD_LIMITS.maxBytes) {
        next.push({ key, file, progress: 0, status: "error", error: "Larger than 15 MB" });
      } else {
        next.push({ key, file, progress: 0, status: "uploading" });
      }
    }
    if (files.length > room) setNotice(`Only the first ${room} file(s) were added (limit ${UPLOAD_LIMITS.maxFiles}).`);
    setItems((prev) => [...prev, ...next]);
    next.filter((n) => n.status === "uploading").forEach(start);
  };

  const retry = (item: UploadItem) => {
    update(item.key, { status: "uploading", progress: 0, error: undefined });
    start({ ...item, status: "uploading", progress: 0 });
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative rounded-2xl border-2 border-dashed text-center transition-colors",
          compact ? "p-5" : "p-8 sm:p-10",
          dragging ? "border-brand-600 bg-brand-50" : "border-line-strong bg-canvas/60 hover:border-brand-200",
        )}
      >
        <button type="button" onClick={() => inputRef.current?.click()} className="mx-auto grid size-12 cursor-pointer place-items-center rounded-2xl bg-white text-brand-600 shadow-[var(--shadow-soft)] transition-transform hover:scale-110 hover:shadow-md" aria-label={label}>
          <UploadCloud className="size-6" strokeWidth={1.75} aria-hidden />
        </button>
        <p className="mt-4 font-semibold text-navy-900">
          <span className="hidden sm:inline">Drag & drop files here, or </span>
          <button type="button" onClick={() => inputRef.current?.click()} className="text-brand-600 underline-offset-4 hover:underline">
            <span className="sm:hidden">Choose files</span>
            <span className="hidden sm:inline">browse</span>
          </button>
        </p>
        <p id={descId} className="mt-1 text-[13px] text-muted">
          {acceptedLabel} · up to 15 MB each · max {UPLOAD_LIMITS.maxFiles} files
        </p>
        <div className="mt-4 flex justify-center sm:hidden">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-line-strong bg-white px-4 text-sm font-semibold text-navy-900"
          >
            <Camera className="size-4" aria-hidden /> Take a photo
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          aria-label={label}
          aria-describedby={descId}
          accept={acceptedExtensions.join(",")}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {notice && (
        <p className="mt-3 flex items-center gap-2 text-sm text-warn-700" role="status">
          <AlertCircle className="size-4" aria-hidden /> {notice}
        </p>
      )}

      {items.length > 0 && (
        <ul className="mt-4 space-y-2" aria-live="polite">
          {items.map((it) => (
            <li key={it.key} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg",
                  it.status === "error" ? "bg-danger-50 text-danger-600" : it.status === "done" ? "bg-success-50 text-success-600" : "bg-brand-50 text-brand-600",
                )}
              >
                {it.status === "done" ? <CheckCircle2 className="size-[18px]" aria-hidden /> : it.status === "error" ? <AlertCircle className="size-[18px]" aria-hidden /> : <FileText className="size-[18px]" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-navy-900">{it.file.name}</p>
                  <span className="shrink-0 text-xs text-muted">
                    {it.status === "uploading" ? `${it.progress}%` : it.status === "done" ? "Uploaded" : formatBytes(it.file.size)}
                  </span>
                </div>
                {it.status === "error" ? (
                  <p className="mt-0.5 text-xs text-danger-600">{it.error}</p>
                ) : (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas" role="progressbar" aria-valuenow={it.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Uploading ${it.file.name}`}>
                    <div className={cn("h-full rounded-full transition-all duration-300", it.status === "done" ? "bg-success-600" : "bg-brand-600")} style={{ width: `${it.progress}%` }} />
                  </div>
                )}
              </div>
              {it.status === "error" && acceptedExtensions.includes(`.${it.file.name.split(".").pop()?.toLowerCase()}`) && it.file.size <= UPLOAD_LIMITS.maxBytes && (
                <button type="button" onClick={() => retry(it)} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-navy-900" aria-label={`Retry ${it.file.name}`}>
                  <RotateCcw className="size-4" aria-hidden />
                </button>
              )}
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((p) => p.key !== it.key))}
                className="grid size-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-navy-900"
                aria-label={`Remove ${it.file.name}`}
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 flex items-center gap-2 text-xs text-muted">
        <Lock className="size-3.5 text-success-600" aria-hidden />
        Files are sent over an encrypted (HTTPS) connection and stored privately — never on public pages.
      </p>
    </div>
  );
}
