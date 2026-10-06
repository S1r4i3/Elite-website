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
      { q: "Can Elite B Tax Services file my FBAR?", a: "Yes. We prepare and e-file FBARs every year, including catch-up filings for past years, and check whether you also need Form 8938." },
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
  {
    slug: "itin-for-spouse-and-children",
    title: "How to Get an ITIN for Your Spouse or Children (Form W-7)",
    seoTitle: "ITIN for Spouse or Children: Form W-7 Guide",
    description:
      "Need an ITIN for your spouse or kids on an H-4 or dependent visa? Learn who needs one, the documents, the 3 ways to apply with Form W-7, timelines and renewals.",
    keywords: ["ITIN for spouse", "ITIN for dependents", "Form W-7", "ITIN application", "ITIN H4 spouse", "ITIN renewal"],
    category: "Individual tax",
    published: "2026-10-07",
    updated: "2026-10-07",
    readMinutes: 6,
    summary:
      "If your spouse or child will be on your U.S. tax return but can't get a Social Security number, they need an ITIN. You apply with Form W-7 for each person, attached to your federal tax return, with a passport or other ID that is original or certified. The IRS says to allow about 7 weeks, and 9 to 11 weeks in tax season or for applications from abroad.",
    sections: [
      {
        h2: "What is an ITIN?",
        blocks: [
          { type: "p", text: "An Individual Taxpayer Identification Number (ITIN) is a 9-digit number the IRS issues to people who need a U.S. tax ID but are not eligible for a Social Security number. It is used only for tax purposes — it does not give work authorization or change immigration status." },
        ],
      },
      {
        h2: "Who in your family needs one?",
        blocks: [
          {
            type: "list",
            items: [
              "A spouse on an H-4, L-2 or similar visa without an SSN, when you file jointly or claim them on your return.",
              "Children or other dependents without an SSN whom you list on your return.",
              "Anyone who must file a U.S. return themselves but cannot get an SSN.",
            ],
          },
          { type: "note", text: "If a family member is eligible for a Social Security number, they should get the SSN instead. An ITIN is only for people who can't." },
        ],
      },
      {
        h2: "How to apply — step by step",
        blocks: [
          {
            type: "steps",
            items: [
              "Fill in a separate Form W-7 for each person who needs an ITIN.",
              "Prepare your federal tax return (Form 1040 or 1040-NR) and leave the SSN box blank for each ITIN applicant.",
              "Gather identity documents: a valid passport works on its own; most other documents must be originals or copies certified by the issuing agency. Dependents also need proof of U.S. residency unless an exception applies.",
              "Submit the W-7s with your tax return in one of three ways (below).",
              "Wait for the IRS letter with the ITIN — the return is processed along with the application.",
            ],
          },
        ],
      },
      {
        h2: "Three ways to submit",
        blocks: [
          {
            type: "table",
            head: ["Option", "How it works", "Good to know"],
            rows: [
              ["Mail to the IRS", "Send the W-7s, return and documents to the IRS ITIN office in Austin", "Your original passports are mailed away until the IRS returns them"],
              ["Certifying Acceptance Agent (CAA)", "An IRS-authorized agent checks and certifies documents, then sends the application", "Fee-based; you usually keep your original passports"],
              ["IRS Taxpayer Assistance Center", "Make an appointment; the IRS verifies documents in person", "Free; appointments can be limited in tax season"],
            ],
          },
        ],
      },
      {
        h2: "How long does it take?",
        blocks: [
          { type: "p", text: "The IRS says to allow 7 weeks to hear about the application, and 9 to 11 weeks if you apply during peak tax season (January 15 to April 30) or from overseas. Applying early in the year, or right after the season, is usually faster." },
        ],
      },
      {
        h2: "Renewing an expired ITIN",
        blocks: [
          { type: "p", text: "An ITIN that is not used on a federal tax return at least once in three consecutive years expires at the end of the third year. Using an expired ITIN on a return can delay your refund and certain credits, so renew it with Form W-7 before you file." },
        ],
      },
    ],
    faqs: [
      { q: "Can my H-4 spouse get an SSN instead of an ITIN?", a: "Only if they are eligible for one — for example, with a work authorization (EAD). If they are not eligible, an ITIN is the way to include them on your return." },
      { q: "Can I apply for an ITIN without filing a tax return?", a: "Usually no. The W-7 is normally filed with a federal return; there are limited exceptions, such as certain treaty or withholding situations." },
      { q: "Do I have to mail our original passports?", a: "Only if you mail the application yourself. A Certifying Acceptance Agent or an IRS Taxpayer Assistance Center can verify documents so you keep the originals." },
      { q: "Can Elite B Tax Services help with the ITIN?", a: "Yes. We prepare the W-7s and your return together, check the documents, and guide you on the fastest way to submit." },
    ],
    services: ["itin", "federal-tax-filing"],
    sources: [
      { label: "IRS — How do I apply for an ITIN?", url: "https://www.irs.gov/individuals/how-do-i-apply-for-an-itin" },
      { label: "IRS — Instructions for Form W-7", url: "https://www.irs.gov/instructions/iw7" },
      { label: "IRS — Taxpayers with expiring ITINs should renew them", url: "https://www.irs.gov/newsroom/taxpayers-with-expiring-itins-should-renew-them-now" },
    ],
  },

  {
    slug: "h1b-resident-or-nonresident-for-tax",
    title: "H-1B, F-1, L-1: Are You a Resident or Nonresident for U.S. Tax?",
    seoTitle: "H-1B Tax: Resident or Nonresident Alien?",
    description:
      "Your visa doesn't decide your tax status — the substantial presence test does. See how H-1B, L-1 and F-1 holders count days, which form to file and common mistakes.",
    keywords: ["H1B tax resident", "substantial presence test", "resident alien vs nonresident alien", "F1 student tax", "1040 vs 1040-NR", "H1B tax filing"],
    category: "NRI & India tax",
    published: "2026-10-07",
    updated: "2026-10-07",
    readMinutes: 6,
    summary:
      "For U.S. tax, you are a resident alien if you pass the substantial presence test: at least 31 days in the U.S. this year and 183 days over three years, counting all days this year, one-third of last year's and one-sixth of the year before. Most H-1B and L-1 workers pass it and file Form 1040 like citizens. F-1 and J students usually don't count their days for their first years, so they often file Form 1040-NR.",
    sections: [
      {
        h2: "Why your tax status matters",
        blocks: [
          {
            type: "table",
            head: ["", "Resident alien", "Nonresident alien"],
            rows: [
              ["Return", "Form 1040", "Form 1040-NR"],
              ["Income taxed", "Worldwide income, including India", "Mainly U.S.-source income"],
              ["FBAR / Form 8938", "Usually required above the thresholds", "Generally not required"],
              ["Standard deduction", "Yes", "Generally no (some treaty exceptions)"],
            ],
          },
        ],
      },
      {
        h2: "The substantial presence test",
        blocks: [
          { type: "p", text: "You are a U.S. tax resident for the year if both are true:" },
          { type: "list", items: ["You were in the U.S. at least 31 days this year.", "This year's days + one-third of last year's days + one-sixth of the year before's days add up to at least 183."] },
          { type: "note", text: "Example: 120 days this year, 240 last year and 180 the year before gives 120 + 80 + 30 = 230 days, so you are a resident." },
        ],
      },
      {
        h2: "H-1B, L-1 and H-4",
        blocks: [
          { type: "p", text: "Work visa days count from the day you arrive. Most H-1B and L-1 holders pass the test in their first full year. If you arrived mid-year, you may be a dual-status taxpayer for that first year — nonresident before arrival, resident after — which has its own filing rules and options, including in some cases choosing to be treated as a resident for the whole year with your spouse." },
        ],
      },
      {
        h2: "F-1, J and other students",
        blocks: [
          { type: "p", text: "Students on F, J, M or Q visas who comply with their visa are 'exempt individuals': their days don't count toward the test, generally for their first five calendar years in the U.S. So most students file Form 1040-NR (and Form 8843), even while working on OPT." },
          { type: "p", text: "When a student changes to H-1B, their days start counting — and the year of the change is often a dual-status year." },
        ],
      },
      {
        h2: "Common mistakes we fix",
        blocks: [
          {
            type: "list",
            items: [
              "Students filing Form 1040 with online software as if they were residents, and claiming credits they can't take.",
              "New H-1B workers forgetting that, once resident, their income from India must be reported.",
              "Missing the FBAR in the first resident year because the Indian accounts were opened years earlier.",
              "Not considering the India–U.S. treaty for students and trainees.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Does an H-1B visa automatically make me a tax resident?", a: "No. The substantial presence test decides it. Most H-1B holders pass it once they have been in the U.S. long enough, but the visa alone doesn't decide." },
      { q: "I'm on F-1 OPT. Which form do I file?", a: "Usually Form 1040-NR with Form 8843, if you are still within your exempt years as a student. Check your arrival year and visa history first." },
      { q: "What is a dual-status year?", a: "A year in which you were a nonresident for part of the year and a resident for the rest — typical in the year you arrive or change from student to H-1B status." },
      { q: "Can you check my status and file the right return?", a: "Yes. We count your days, check exemptions and treaty benefits, and prepare the correct return, including any FBAR." },
    ],
    services: ["federal-tax-filing", "indian-tax-services", "fbar"],
    sources: [
      { label: "IRS — Substantial presence test", url: "https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" },
      { label: "IRS — Publication 519, U.S. Tax Guide for Aliens", url: "https://www.irs.gov/publications/p519" },
    ],
  },
];

export const guideBySlug = new Map(guides.map((g) => [g.slug, g]));
export const getGuide = (slug: string) => guideBySlug.get(slug);
