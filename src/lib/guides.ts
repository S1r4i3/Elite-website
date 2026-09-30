import type { Faq } from "./faqs";

/**
 * Tax guides (/guides). Plain-language answers to the questions people search for,
 * each linking to the service that solves it. Keep facts sourced from IRS / FinCEN pages
 * and update `updated` whenever a guide is reviewed.
 */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "note"; text: string };

export type Guide = {
  slug: string;
  /** H1 on the page. */
  title: string;
  /** <title> — keep under ~60 characters. */
  seoTitle: string;
  /** Meta description — 140–160 characters. */
  description: string;
  keywords: string[];
  category: "FBAR & FATCA" | "NRI & India tax" | "Individual tax" | "Business tax";
  published: string; // YYYY-MM-DD
  updated: string; // YYYY-MM-DD
  readMinutes: number;
  /** Short answer shown at the top (and good for featured snippets). */
  summary: string;
  sections: { h2: string; blocks: GuideBlock[] }[];
  faqs: Faq[];
  /** Service slugs this guide leads to. */
  services: string[];
  sources: { label: string; url: string }[];
};

const IRS_FBAR = { label: "IRS — Report of Foreign Bank and Financial Accounts (FBAR)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar" };
const IRS_COMPARE = { label: "IRS — Comparison of Form 8938 and FBAR requirements", url: "https://www.irs.gov/businesses/comparison-of-form-8938-and-fbar-requirements" };
const FINCEN = { label: "FinCEN — Report Foreign Bank and Financial Accounts", url: "https://www.fincen.gov/report-foreign-bank-and-financial-accounts" };
const IRS_FATCA = { label: "IRS — FATCA information for individuals", url: "https://www.irs.gov/businesses/corporations/fatca-information-for-individuals" };

export const guides: Guide[] = [
  {
    slug: "fbar-for-indians-in-usa",
    title: "FBAR for Indians in the USA: Who Must File, Deadline and Penalties",
    seoTitle: "FBAR for Indians in the USA: Who Files & Deadline",
    description:
      "Living in the US with bank accounts in India? Learn who must file FBAR (FinCEN 114), the $10,000 rule, the deadline, which Indian accounts count and how to fix missed years.",
    keywords: ["FBAR for Indians", "FBAR NRI", "FinCEN 114", "FBAR filing India bank account", "FBAR deadline", "FBAR penalty"],
    category: "FBAR & FATCA",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 7,
    summary:
      "If you are a U.S. person — a citizen, green card holder or a resident for tax purposes (most H-1B and L-1 workers) — and the combined balance of all your accounts outside the U.S. was more than $10,000 at any time in the year, you must file an FBAR (FinCEN Form 114). It is filed online with FinCEN, separately from your tax return, and is due April 15 with an automatic extension to October 15.",
    sections: [
      {
        h2: "What is the FBAR?",
        blocks: [
          { type: "p", text: "FBAR stands for Report of Foreign Bank and Financial Accounts. It is a yearly report, filed as FinCEN Form 114, that lists your accounts outside the United States and the highest balance each one reached during the year." },
          { type: "p", text: "The FBAR is a disclosure only — it does not add any tax. But the penalties for not filing can be large, which is why it matters so much for Indian families who keep savings, deposits or investments back home." },
        ],
      },
      {
        h2: "Who must file an FBAR?",
        blocks: [
          { type: "p", text: "You must file if both of these are true:" },
          {
            type: "list",
            items: [
              "You are a U.S. person: a U.S. citizen, a green card holder, or a resident alien for tax purposes. Many people on H-1B, L-1 or H-4 visas become tax residents by meeting the substantial presence test.",
              "The total of the highest balances of all your foreign financial accounts was more than $10,000 at any time during the calendar year.",
            ],
          },
          { type: "note", text: "The $10,000 is the combined total, not per account. Three accounts with $4,000 each at their peak add up to $12,000 — so you must file, and you report all three." },
        ],
      },
      {
        h2: "Which Indian accounts count?",
        blocks: [
          { type: "p", text: "Almost any account held with a financial institution outside the U.S. counts, including accounts in your name alone, joint accounts, and accounts where you only have signing authority. Common examples for Indian families:" },
          {
            type: "list",
            items: [
              "NRO, NRE and FCNR accounts, and old resident savings accounts",
              "Fixed deposits and recurring deposits",
              "Demat and brokerage accounts",
              "Mutual fund accounts",
              "Joint accounts with parents — report the full balance, not just your share",
              "Accounts you can operate for someone else (for example a parent's account where you hold a mandate)",
              "Insurance policies with a cash or surrender value",
            ],
          },
          { type: "p", text: "Some items — such as PPF, EPF and certain pension schemes — need a closer look at how the account is held. If you are unsure, list it for us and we will tell you how it should be reported." },
        ],
      },
      {
        h2: "When is the FBAR due and how is it filed?",
        blocks: [
          { type: "list", items: ["Due date: April 15 for the previous calendar year.", "Automatic extension: to October 15 — you don't need to request it.", "Where: electronically through FinCEN's BSA E-Filing System. It is not mailed with your Form 1040."] },
          { type: "p", text: "For each account you report the bank name and address, account number, type, and the maximum value during the year. Balances in rupees are converted to dollars using the U.S. Treasury's exchange rate for the last day of the year." },
        ],
      },
      {
        h2: "What are the penalties?",
        blocks: [
          { type: "p", text: "Penalties depend on whether the failure was non-willful (an honest mistake) or willful:" },
          {
            type: "list",
            items: [
              "Non-willful: up to $10,000 per violation, adjusted each year for inflation. In 2023 the U.S. Supreme Court (Bittner v. United States) ruled that this penalty applies per report, not per account.",
              "Willful: up to the greater of $100,000 (inflation-adjusted) or 50% of the account balance, and possible criminal penalties.",
            ],
          },
          { type: "p", text: "The good news: people who simply didn't know about the FBAR usually have safe ways to become compliant — before the IRS contacts them." },
        ],
      },
      {
        h2: "Missed FBARs in past years? What to do",
        blocks: [
          { type: "p", text: "Don't just start filing this year and ignore the past. The IRS has specific procedures for late filers, and choosing the right one matters:" },
          {
            type: "list",
            items: [
              "Delinquent FBAR submission procedures — for people who reported all their income (for example Indian interest) on their U.S. returns but didn't file FBARs.",
              "Streamlined filing compliance procedures — for people who also missed income on their returns, where the failure was non-willful.",
            ],
          },
          { type: "p", text: "Which one fits depends on your facts. We review your history, prepare the missing FBARs and any amended returns, and file them the right way." },
        ],
      },
      {
        h2: "FBAR is not the only form — check Form 8938 and your income",
        blocks: [
          { type: "p", text: "Depending on your total foreign assets, you may also need Form 8938 (FATCA), which is filed with your tax return. And interest earned in India — including NRE interest that is tax-free in India — is generally taxable income on your U.S. return. Indian mutual funds can bring extra reporting as well. See our guide on FBAR vs FATCA for the difference." },
        ],
      },
    ],
    faqs: [
      { q: "Does filing an FBAR mean I pay tax on my Indian money?", a: "No. The FBAR only reports the accounts. Tax is a separate question: income such as interest, dividends and capital gains from India is generally reported on your U.S. tax return, with credit for Indian tax where the rules allow." },
      { q: "I'm on an H-1B visa. Do I need to file?", a: "Usually yes, if you are a U.S. tax resident (most H-1B holders are after meeting the substantial presence test) and your foreign accounts together were above $10,000 at any time in the year." },
      { q: "My parents added me to their account in India. Do I report it?", a: "Yes. If you are a joint holder or can operate the account, it is reportable, and you report the full account value." },
      { q: "What exchange rate do I use?", a: "The U.S. Treasury's Reporting Rates of Exchange for the last day of the calendar year, applied to each account's highest balance." },
      { q: "Can Elite Tax Services file my FBAR?", a: "Yes. We prepare and e-file FBARs every year, including catch-up filings for past years, and check whether you also need Form 8938." },
    ],
    services: ["fbar", "fatca", "indian-tax-services"],
    sources: [IRS_FBAR, FINCEN, IRS_COMPARE],
  },

  {
    slug: "report-indian-bank-accounts-to-irs",
    title: "Do You Need to Report Indian Bank Accounts and FDs to the IRS?",
    seoTitle: "Reporting Indian Bank Accounts & FDs to the IRS",
    description:
      "NRO, NRE, fixed deposits, mutual funds: what U.S. residents must report to the IRS, which forms apply (FBAR, Form 8938) and how Indian interest is taxed in the US.",
    keywords: ["report Indian bank account to IRS", "NRE account US tax", "NRO account IRS", "Indian fixed deposit US tax", "Indian mutual funds PFIC"],
    category: "NRI & India tax",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 6,
    summary:
      "Yes — if you are a U.S. tax resident, your accounts in India usually have to be reported, and the income from them taxed. Reporting happens on up to two forms (FBAR and Form 8938) depending on balances, and the interest, dividends and gains go on your U.S. tax return — even when they were tax-free or already taxed in India.",
    sections: [
      {
        h2: "Two separate questions: reporting and tax",
        blocks: [
          { type: "p", text: "Many people mix these up. Reporting means telling the U.S. government the accounts exist. Tax means paying U.S. tax on the income those accounts earn. You can owe one without the other." },
          {
            type: "table",
            head: ["Question", "What applies"],
            rows: [
              ["Do I list the account?", "FBAR if all foreign accounts together exceed $10,000 at any time in the year; Form 8938 if you cross its higher thresholds"],
              ["Do I pay U.S. tax on the income?", "Generally yes — interest, dividends, rent and capital gains from India go on your U.S. return"],
              ["Is Indian tax credited?", "Often yes, through the foreign tax credit and the India–U.S. tax treaty, depending on the income"],
            ],
          },
        ],
      },
      {
        h2: "NRO, NRE and FCNR accounts",
        blocks: [
          {
            type: "list",
            items: [
              "NRO account: interest is taxed in India (tax is usually deducted at source) and is also reportable on your U.S. return. The Indian tax can often be claimed as a credit.",
              "NRE account: interest is tax-free in India, but it is still taxable income in the U.S. for a U.S. tax resident.",
              "FCNR deposits: same idea — the interest is generally taxable in the U.S., and the account is reportable.",
            ],
          },
          { type: "note", text: "“Tax-free in India” does not mean tax-free in the U.S. This is one of the most common mistakes we fix." },
        ],
      },
      {
        h2: "Fixed and recurring deposits",
        blocks: [
          { type: "p", text: "Fixed deposits and recurring deposits are financial accounts: they count toward the FBAR $10,000 total and may count for Form 8938. The interest is generally taxable in the U.S. in the year it is earned — even if it is only paid out when the deposit matures." },
        ],
      },
      {
        h2: "Mutual funds, shares and demat accounts",
        blocks: [
          { type: "p", text: "Demat and brokerage accounts are reportable on the FBAR. Shares or funds you hold directly may also belong on Form 8938." },
          { type: "p", text: "Indian mutual funds deserve special attention: for U.S. tax purposes they are usually treated as PFICs (passive foreign investment companies), which can mean extra forms (Form 8621) and less favourable tax treatment. If you own Indian mutual funds, talk to us before you sell or add more." },
        ],
      },
      {
        h2: "What happens if I never reported?",
        blocks: [
          { type: "p", text: "You are not alone — many people learn about these rules years after moving to the U.S. The IRS offers ways to catch up, and the right path depends on whether the income was reported and why the forms were missed. Acting before the IRS contacts you keeps the most options open." },
          { type: "steps", items: ["List every Indian account and investment you've had in the last six years.", "Gather year-end and highest balances, and the interest or gains for each year.", "Let us check which forms were required and which procedure fits.", "We prepare the missing FBARs, forms and any amended returns."] },
        ],
      },
    ],
    faqs: [
      { q: "Is NRE interest taxable in the US?", a: "For a U.S. tax resident, generally yes. NRE interest is tax-free in India, but the U.S. taxes residents on worldwide income." },
      { q: "Do I report an account that has very little money?", a: "If your foreign accounts together crossed $10,000 at any time in the year, every account is listed on the FBAR — including small ones." },
      { q: "My fixed deposit hasn't matured. Do I still report the interest?", a: "Usually yes. Interest that is credited or accrues during the year is generally reported in that year, not only at maturity." },
      { q: "Will I be taxed twice?", a: "The India–U.S. tax treaty and the U.S. foreign tax credit are designed to reduce double taxation. We coordinate both sides so available credits are claimed." },
    ],
    services: ["indian-tax-services", "fbar", "fatca"],
    sources: [IRS_FBAR, IRS_COMPARE, IRS_FATCA],
  },

  {
    slug: "fbar-vs-fatca-form-8938",
    title: "FBAR vs FATCA (Form 8938): What's the Difference?",
    seoTitle: "FBAR vs FATCA Form 8938: Key Differences",
    description:
      "FBAR (FinCEN 114) and FATCA Form 8938 both report foreign assets but have different thresholds, deadlines and penalties. See a side-by-side comparison and who must file both.",
    keywords: ["FBAR vs FATCA", "Form 8938 vs FBAR", "Form 8938 threshold", "FATCA reporting individuals", "FinCEN 114 vs 8938"],
    category: "FBAR & FATCA",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 5,
    summary:
      "The FBAR (FinCEN Form 114) is filed with FinCEN when your foreign accounts together exceed $10,000 at any time in the year. Form 8938 (FATCA) is filed with your IRS tax return and has much higher thresholds — for a single person living in the U.S., more than $50,000 at year-end or $75,000 at any time. Many people must file both; one never replaces the other.",
    sections: [
      {
        h2: "Side-by-side comparison",
        blocks: [
          {
            type: "table",
            head: ["", "FBAR (FinCEN 114)", "Form 8938 (FATCA)"],
            rows: [
              ["Filed with", "FinCEN, online (BSA E-Filing)", "The IRS, attached to your tax return"],
              ["Threshold", "All foreign accounts together over $10,000 at any time in the year", "Higher — depends on filing status and where you live (see below)"],
              ["Due date", "April 15, automatic extension to October 15", "Same as your tax return, including extensions"],
              ["Accounts you can only sign on", "Reported", "Not reported"],
              ["Foreign shares held directly", "Not reported", "Reported"],
              ["Foreign mutual funds", "Reported", "Reported"],
              ["Foreign real estate held directly", "Not reported", "Not reported"],
              ["Penalty for not filing", "Non-willful up to $10,000 (inflation-adjusted); willful up to the greater of $100,000 or 50% of the balance", "Up to $10,000, plus up to $50,000 more if you don't file after an IRS notice"],
            ],
          },
        ],
      },
      {
        h2: "Form 8938 thresholds",
        blocks: [
          {
            type: "table",
            head: ["You are…", "Living in the U.S.", "Living outside the U.S."],
            rows: [
              ["Single or married filing separately", "More than $50,000 on the last day of the year, or more than $75,000 at any time", "More than $200,000 on the last day of the year, or more than $300,000 at any time"],
              ["Married filing jointly", "More than $100,000 on the last day of the year, or more than $150,000 at any time", "More than $400,000 on the last day of the year, or more than $600,000 at any time"],
            ],
          },
          { type: "note", text: "Form 8938 is only required if you must file a U.S. income tax return for the year. The FBAR has no such condition." },
        ],
      },
      {
        h2: "Do I need to file both?",
        blocks: [
          { type: "p", text: "Often, yes. Anyone above the Form 8938 threshold is almost always above the $10,000 FBAR threshold too. Filing Form 8938 does not satisfy the FBAR requirement, and filing an FBAR does not satisfy Form 8938." },
          {
            type: "steps",
            items: [
              "Add up the highest balance of every foreign account for the year. Over $10,000? File an FBAR.",
              "Add up your foreign financial assets (accounts plus directly held foreign shares, funds and similar) at year-end and at their peak. Over your 8938 threshold? Attach Form 8938 to your return.",
              "Report the income from those assets on your return, with foreign tax credits where they apply.",
            ],
          },
        ],
      },
      {
        h2: "A quick example",
        blocks: [
          { type: "p", text: "Priya is single, lives in Texas on an H-1B, and has an NRO account ($8,000 at its peak), a fixed deposit ($30,000) and Indian shares in a demat account ($25,000) — about $63,000 in total at the end of the year." },
          {
            type: "list",
            items: [
              "FBAR: yes — her accounts together are well over $10,000. She lists the NRO account, the FD and the demat account.",
              "Form 8938: yes — her foreign assets are over $50,000 at year-end.",
              "Tax return: the NRO and FD interest and any dividends or gains go on her Form 1040.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Is FATCA the same as FBAR?", a: "No. FATCA reporting for individuals is Form 8938, filed with your tax return. The FBAR is FinCEN Form 114, filed separately online. The rules, thresholds and penalties are different." },
      { q: "If I file Form 8938, do I still need an FBAR?", a: "Yes, if your foreign accounts together exceeded $10,000 at any time in the year. The two filings don't replace each other." },
      { q: "Do I report my house in India on either form?", a: "Real estate you own directly is not reported on either form. Rental income from it is still reported on your tax return." },
      { q: "Can you file both for me?", a: "Yes. We prepare your FBAR and, when needed, Form 8938 alongside your tax return, so the numbers match across both." },
    ],
    services: ["fatca", "fbar", "federal-tax-filing"],
    sources: [IRS_COMPARE, IRS_FATCA, IRS_FBAR],
  },
];

export const guideBySlug = new Map(guides.map((g) => [g.slug, g]));
export const getGuide = (slug: string) => guideBySlug.get(slug);
