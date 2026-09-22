"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FileDropzone } from "@/components/forms/file-dropzone";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/input";
import { documentTypes, portalTaxYears } from "@/lib/portal";

export function UploadPanel({ category: controlled, onCategoryChange }: { category?: string; onCategoryChange?: (v: string) => void } = {}) {
  const router = useRouter();
  const [own, setOwn] = useState("w2");
  const category = controlled ?? own;
  const setCategory = (v: string) => (onCategoryChange ? onCategoryChange(v) : setOwn(v));
  const [taxYear, setTaxYear] = useState(portalTaxYears[0]);
  const [count, setCount] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="card p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="doc-type">Document type</Label>
          <NativeSelect id="doc-type" value={category} onChange={(e) => setCategory(e.target.value)}>
            {documentTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <Label htmlFor="tax-year">Tax year</Label>
          <NativeSelect id="tax-year" value={taxYear} onChange={(e) => { setTaxYear(e.target.value); setResetKey((k) => k + 1); }}>
            {portalTaxYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
      <div className="mt-6">
        <FileDropzone
          key={`${resetKey}-${category}`}
          endpoint="/api/me/documents"
          category={category}
          extraFields={{ taxYear }}
          label="Upload tax documents"
          onUploaded={() => {
            setCount((c) => c + 1);
            router.refresh();
          }}
        />
      </div>
      {count > 0 && (
        <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-xl border border-success-600/20 bg-success-50 p-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-sm font-medium text-success-700">
            <CheckCircle2 className="size-5" aria-hidden /> {count} file{count === 1 ? "" : "s"} uploaded. Your tax professional can see {count === 1 ? "it" : "them"} now.
          </p>
          <Link href="/dashboard/my-documents" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View My Documents <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
