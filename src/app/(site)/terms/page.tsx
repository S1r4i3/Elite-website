import { ProsePage } from "@/components/content/prose-page";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description = "The terms for using the Elite B Tax Services website and client portal, and how our tax preparation engagements work.";
export const metadata = pageMetadata({ title: "Terms & Conditions", description, path: "/terms" });

export default function Page() {
  return (
    <ProsePage
      title="Terms & Conditions"
      description={description}
      path="/terms"
      updated="2026-10-07"
      intro={`These terms apply when you use elitebtax.com and the ${site.name} client portal, operated by ${site.legalName}.`}
      related={[
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Disclaimer", href: "/disclaimer" },
      ]}
      sections={[
        {
          h2: "Using this website",
          paragraphs: [
            "The website explains our services and publishes general tax information. That information is educational and is not advice for your situation — see our Disclaimer. Do not rely on it to make tax decisions without professional advice.",
          ],
        },
        {
          h2: "Engaging us",
          paragraphs: [
            "Submitting a form or creating an account does not by itself create a client engagement. We confirm the scope of work and the fee with you before any work begins, and you approve your return before it is filed.",
          ],
        },
        {
          h2: "Your responsibilities",
          list: [
            "Give complete and accurate information and documents, and tell us about all income, accounts and changes in your situation.",
            "Review drafts carefully before approving them; you remain responsible for the contents of your returns.",
            "Keep your portal password private and tell us if you think your account has been used by someone else.",
          ],
        },
        {
          h2: "Client portal",
          paragraphs: [
            "The portal is for sharing documents with us securely. Upload only documents related to your tax matters. We may suspend accounts used for anything else or that put other clients' information at risk.",
          ],
        },
        {
          h2: "Fees",
          paragraphs: ["Fees depend on the complexity of your situation and are agreed with you in advance. Government fees, penalties and taxes owed are separate and are your responsibility."],
        },
        {
          h2: "Intellectual property",
          paragraphs: [`The website's content, design and logo belong to ${site.legalName}. You may share links to our pages, but not copy the content as your own.`],
        },
        {
          h2: "Limitation of liability",
          paragraphs: [
            "We work carefully, but the website is provided as is. To the extent the law allows, we are not responsible for losses that come from relying on general website content, or from information you did not give us.",
          ],
        },
        {
          h2: "Contact",
          paragraphs: [`Questions about these terms: ${site.email} · ${site.phone.display}.`],
        },
      ]}
    />
  );
}
