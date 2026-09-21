import Link from "next/link";
import { BadgeCheck, ExternalLink, MessageSquareQuote, Star } from "lucide-react";
import { SectionHeader } from "./section-header";
import { reviews, reviewProfileUrl } from "@/lib/reviews";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`} role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={i < n ? "size-4 fill-amber-400 text-amber-400" : "size-4 text-line-strong"} aria-hidden />
      ))}
    </div>
  );
}

export function Reviews({ limit = 6, as = "h2" }: { limit?: number; as?: "h1" | "h2" }) {
  const list = reviews.slice(0, limit);
  return (
    <section className="section-y bg-canvas" aria-labelledby="reviews-heading">
      <div className="container-x">
        <SectionHeader as={as} eyebrow="Client reviews" title={<span id="reviews-heading">What Our Clients Say</span>} subtitle="Real feedback from real clients, linked to where it was posted." />
        {list.length > 0 ? (
          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => (
              <li key={r.name + r.text.slice(0, 12)} data-reveal className="card flex flex-col p-6 sm:p-7">
                <Stars n={r.rating} />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">“{r.text}”</blockquote>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">
                      {r.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{r.name}</p>
                      <p className="text-[12px] text-muted">{r.service}</p>
                    </div>
                  </div>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-medium text-success-700 hover:underline">
                    <BadgeCheck className="size-3.5" aria-hidden /> {r.source}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card mx-auto mt-12 max-w-2xl p-8 text-center sm:p-12">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <MessageSquareQuote className="size-7" strokeWidth={1.5} aria-hidden />
            </span>
            {site.stats.show && (
              <p className="mt-5 font-display text-4xl font-extrabold text-navy-900">
                {site.stats.rating.value}
                <span className="text-xl text-muted">/5</span>
              </p>
            )}
            {site.stats.show && <p className="mt-1 text-sm text-muted">Customer rating as published by Elite Tax Services</p>}
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              We&apos;re gathering verified reviews from our clients. Once published, each one will link to the platform it was posted on.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              {reviewProfileUrl && (
                <Button asChild variant="secondary">
                  <a href={reviewProfileUrl} target="_blank" rel="noopener noreferrer">
                    Read reviews <ExternalLink aria-hidden />
                  </a>
                </Button>
              )}
              <Button asChild>
                <Link href="/contact">Become a client</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
