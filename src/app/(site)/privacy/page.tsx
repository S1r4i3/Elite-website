import { PageHero } from "@/components/sections/page-hero";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy Policy", description: `How ${site.name} collects, uses and protects your information.`, path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="How we collect, use and protect your information." crumbs={[{ label: "Privacy Policy", href: "/privacy" }]} primary={null} secondary={null} showCallLine={false} />
      <article className="container-x max-w-3xl py-14 text-[15px] leading-relaxed text-ink [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        <p className="rounded-xl bg-warn-50 p-4 text-sm text-warn-700">
          Template — have this policy reviewed by qualified counsel and updated to reflect your actual practices before launch.
        </p>
        <h2>Information we collect</h2>
        <p>When you contact us or request services, we collect information you provide, such as your name, email, phone number, service needs, tax year, messages and any documents you upload.</p>
        <h2>How we use it</h2>
        <ul>
          <li>To respond to your request and provide tax services</li>
          <li>To communicate with you by phone, email or text about your request</li>
          <li>To comply with legal and regulatory obligations</li>
        </ul>
        <h2>Documents</h2>
        <p>Uploaded documents are transmitted over HTTPS, stored privately and accessed only by authorized personnel for the purpose of providing your requested services.</p>
        <h2>Sharing</h2>
        <p>We do not sell your personal information. We share information only as needed to provide services (for example, filing with tax authorities) or as required by law.</p>
        <h2>Contact</h2>
        <p>
          Questions? Contact {site.legalName} at {site.email} or {site.phone.display}, {site.address.display}.
        </p>
      </article>
    </>
  );
}
