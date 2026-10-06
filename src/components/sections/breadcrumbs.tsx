import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/utils";

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 text-subtle" aria-hidden />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="font-medium text-navy-900">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-brand-600">{c.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": `${absoluteUrl(all[all.length - 1].href)}#breadcrumb`,
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
        }}
      />
    </>
  );
}
