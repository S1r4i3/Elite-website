import { PageHero } from "@/components/sections/page-hero";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms of Use", description: `Terms of use for the ${site.name} website.`, path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Use" subtitle="The terms that apply when you use this website." crumbs={[{ label: "Terms", href: "/terms" }]} primary={null} secondary={null} showCallLine={false} />
      <article className="container-x max-w-3xl py-14 text-[15px] leading-relaxed text-ink [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-3">
        <p className="rounded-xl bg-warn-50 p-4 text-sm text-warn-700">
          Template — have these terms reviewed by qualified counsel before launch.
        </p>
        <h2>General information only</h2>
        <p>Content on this website is general information and not tax, legal or financial advice for your specific situation. Estimates are not guarantees.</p>
        <h2>No client relationship</h2>
        <p>Submitting a form does not by itself create a client relationship. An engagement begins only after we confirm the services and terms with you.</p>
        <h2>Accuracy</h2>
        <p>Tax laws change frequently. We work to keep information current but cannot guarantee that all content is complete or up to date.</p>
        <h2>Contact</h2>
        <p>
          {site.legalName} · {site.address.display} · {site.email}
        </p>
      </article>
    </>
  );
}
