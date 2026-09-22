"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Lock, Phone, ArrowRight } from "lucide-react";
import { leadSchema, taxYearOptions, type LeadInput, type LeadData } from "@/lib/validation/lead";
import { serviceOptions, customerTypeOptions } from "@/lib/services";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = {
  defaultService?: string;
  source?: string;
  estimate?: Record<string, unknown>;
  submitLabel?: string;
  className?: string;
  showUpload?: boolean;
};

function Field({ id, label, error, children, optional }: { id: string; label: string; error?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div>
      <Label htmlFor={id}>
        {label} {optional && <span className="font-normal text-subtle">(optional)</span>}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-[13px] text-danger-600">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

export function LeadForm({ defaultService, source, estimate, submitLabel = "Submit Request", className, showUpload: _showUpload = false }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const uploadsBusy = false;

  const validService = serviceOptions.some((o) => o.value === defaultService) ? defaultService : "";
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<LeadInput, unknown, LeadData>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: validService as LeadInput["service"],
      customerType: "" as LeadInput["customerType"],
      taxYear: "",
      message: "",
      documentIds: [],
      source,
      estimate,
      website: "",
    },
  });


  const onSubmit = async (data: LeadData) => {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, source: source ?? (typeof window !== "undefined" ? window.location.pathname : undefined), estimate }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.fieldErrors) {
          for (const [k, v] of Object.entries(json.fieldErrors as Record<string, string[]>)) {
            setError(k as keyof LeadInput, { message: v?.[0] });
          }
        }
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      reset();
    } catch (e) {
      setServerError((e as Error).message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={cn("card p-8 text-center sm:p-12", className)} role="status" aria-live="polite">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-50 text-success-600">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl font-extrabold">Thanks! Your request has been received.</h3>
        <p className="mx-auto mt-3 max-w-md text-muted">Our team will contact you shortly.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="secondary">
            <a href={site.phone.href}>
              <Phone aria-hidden /> Call {site.phone.display}
            </a>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/how-it-works">
              See what happens next <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const aria = (name: keyof LeadInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("card p-5 sm:p-8", className)} aria-label="Request tax help">
      {status === "error" && serverError && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-danger-600/20 bg-danger-50 p-4 text-sm text-danger-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">We couldn&apos;t submit your request</p>
            <p className="mt-0.5">
              {serverError} You can also call us at{" "}
              <a href={site.phone.href} className="font-semibold underline">
                {site.phone.display}
              </a>
              .
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName?.message}>
          <Input id="firstName" autoComplete="given-name" {...register("firstName")} {...aria("firstName")} />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName?.message}>
          <Input id="lastName" autoComplete="family-name" {...register("lastName")} {...aria("lastName")} />
        </Field>
        <Field id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" inputMode="email" autoComplete="email" {...register("email")} {...aria("email")} />
        </Field>
        <Field id="phone" label="Phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+1" {...register("phone")} {...aria("phone")} />
        </Field>
        <Field id="service" label="Service required" error={errors.service?.message}>
          <NativeSelect id="service" {...register("service")} {...aria("service")}>
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field id="customerType" label="Customer type" error={errors.customerType?.message}>
          <NativeSelect id="customerType" {...register("customerType")} {...aria("customerType")}>
            <option value="" disabled>
              Select one
            </option>
            {customerTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field id="taxYear" label="Tax year" error={errors.taxYear?.message}>
          <NativeSelect id="taxYear" {...register("taxYear")} {...aria("taxYear")}>
            <option value="" disabled>
              Select tax year
            </option>
            {taxYearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <div className="sm:col-span-2">
          <Field id="message" label="Message" optional error={errors.message?.message}>
            <Textarea id="message" rows={4} placeholder="Tell us briefly about your situation…" {...register("message")} {...aria("message")} />
          </Field>
        </div>
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>


      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-muted">
          <Lock className="size-3.5 text-success-600" aria-hidden /> Your information is kept confidential.
        </p>
        <Button type="submit" size="lg" disabled={status === "submitting" || uploadsBusy} className="w-full sm:w-auto">
          {status === "submitting" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Submitting…
            </>
          ) : uploadsBusy ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Uploading files…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
