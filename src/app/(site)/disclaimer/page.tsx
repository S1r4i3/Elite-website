import { ProsePage } from "@/components/content/prose-page";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description = "Our tax guides and service pages are general information, not tax, legal or financial advice. Here is how we write, source and update them.";
export const metadata = pageMetadata({ title: "Disclaimer & Editorial Policy", description, path: "/disclaimer" });

export default function Page() {
  return (
    <ProsePage
      title="Disclaimer & Editorial Policy"
      description={description}
      path="/disclaimer"
      updated="2026-10-07"
      intro="What you can expect from the information on this website, and how we keep it accurate."
      related={[
        { label: "Tax guides", href: "/guides" },
        { label: "Tax deadlines", href: "/tax-deadlines" },
        { label: "Privacy Policy", href: "/privacy" },
      ]}
      sections={[
        {
          h2: "General information, not advice",
          paragraphs: [
            "Our guides, service pages and FAQs explain common U.S. and Indian tax rules in plain language. They are not tax, legal or financial advice for your situation, and reading them does not create a client relationship. Tax outcomes depend on your full facts — talk to a professional before you act.",
          ],
        },
        {
          h2: "How we write and source content",
          list: [
            "Factual statements are based on official sources such as IRS.gov, FinCEN and the Income Tax Department of India, which we link from each guide.",
            "Each guide shows the date it was published and last updated.",
            "We write for the questions our clients actually ask — especially U.S. residents with ties to India — and avoid filler.",
            "When rules or inflation-adjusted amounts change, we update the page and its date.",
          ],
        },
        {
          h2: "Dates and amounts change",
          paragraphs: [
            "Deadlines move when they fall on weekends or holidays, and governments sometimes extend them. Thresholds and penalty amounts can be adjusted each year. Always confirm current figures with the official source or with us before filing.",
          ],
        },
        {
          h2: "Links to other websites",
          paragraphs: ["We link to government and other sites for reference. We are not responsible for their content or availability."],
        },
        {
          h2: "Found an error?",
          paragraphs: [`Tell us at ${site.email} and we will review and correct it.`],
        },
      ]}
    />
  );
}
