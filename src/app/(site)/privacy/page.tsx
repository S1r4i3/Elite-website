import { ProsePage } from "@/components/content/prose-page";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description = "How Elite B Tax Services collects, uses, stores and protects your personal information and tax documents on our website and client portal.";
export const metadata = pageMetadata({ title: "Privacy Policy", description, path: "/privacy" });

export default function Page() {
  return (
    <ProsePage
      title="Privacy Policy"
      description={description}
      path="/privacy"
      updated="2026-10-07"
      intro={`This policy explains what information ${site.name} (operated by ${site.legalName}) collects, why, and how it is protected.`}
      related={[
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
        { label: "Contact us", href: "/contact" },
      ]}
      sections={[
        {
          h2: "Information we collect",
          list: [
            "Contact details you send through our forms: name, email, phone number, the service you need and your message.",
            "Client portal account details: name, email, phone, date of birth, address, state and country, and your sign-in credentials (passwords are never stored in readable form).",
            "Tax documents you upload, and the draft and final documents we share with you.",
            "Basic technical data our hosting providers log automatically, such as IP address, browser type and pages requested, used for security and troubleshooting.",
          ],
        },
        {
          h2: "How we use it",
          list: [
            "To respond to your enquiry and give you a quote.",
            "To prepare, review and file your returns and related forms when you engage us.",
            "To send account emails, such as verification, password reset and status updates.",
            "To meet legal and professional record-keeping requirements.",
            "To keep the website and portal secure and working properly.",
          ],
          paragraphs: ["We do not sell your personal information, and we do not use your tax documents for advertising."],
        },
        {
          h2: "When we share information",
          list: [
            "With tax authorities — such as the IRS, FinCEN, state tax agencies or the Income Tax Department of India — when we file on your behalf at your direction.",
            "With service providers that run our infrastructure under contract (secure database and file storage, website hosting and email delivery), only as needed to provide the service.",
            "When the law requires it, for example in response to a valid legal request.",
          ],
        },
        {
          h2: "How we protect your documents",
          paragraphs: [
            "Documents are uploaded over encrypted connections (HTTPS) to private storage that is not publicly accessible. Inside our team, each client file is visible only to the staff member currently working on it and to administrators. Downloads go through authenticated links.",
            "No system is perfectly secure. If you believe your account has been accessed without permission, contact us right away.",
          ],
        },
        {
          h2: "How long we keep information",
          paragraphs: [
            "We keep client records for as long as needed to provide our services and to meet legal obligations — tax return preparers, for example, must keep a copy or list of the returns they prepare for at least three years. Enquiries that do not become engagements are deleted when no longer needed.",
          ],
        },
        {
          h2: "Cookies",
          paragraphs: [
            "We use essential cookies to keep you signed in to the client portal and to protect forms from abuse. If we enable website analytics, it is used only to understand how the site is used in aggregate.",
          ],
        },
        {
          h2: "Your choices and rights",
          paragraphs: [
            "You can review and update your profile in the client portal, and you can ask us to access, correct or delete your information. Some records must be kept for legal reasons; when that applies we will tell you.",
          ],
        },
        {
          h2: "Children",
          paragraphs: ["Our website is not directed at children. We collect information about dependents only when an adult client provides it for their tax return."],
        },
        {
          h2: "Contact",
          paragraphs: [`Questions about this policy: email ${site.email} or call ${site.phone.display}. Mailing address: ${site.address.display}.`],
        },
        {
          h2: "Changes to this policy",
          paragraphs: ["If we change this policy, we will update the date at the top of this page."],
        },
      ]}
    />
  );
}
