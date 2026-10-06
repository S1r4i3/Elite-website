/**
 * Extra, fact-checked detail for each service page: forms, deadlines, common mistakes and sources.
 * Keep every statement traceable to the linked official source. Dates are the usual calendar-year
 * rules; when a due date falls on a weekend or legal holiday it moves to the next business day.
 */
export type ServiceDetail = {
  forms: { form: string; what: string }[];
  deadlines: { when: string; what: string }[];
  mistakes: string[];
  sources: { label: string; url: string }[];
  /** Guides that go deeper on this topic (slugs from lib/guides.ts). */
  guideSlugs?: string[];
};

const IRS = (label: string, url: string) => ({ label: `IRS — ${label}`, url });

export const serviceDetails: Record<string, ServiceDetail> = {
  "federal-tax-filing": {
    forms: [
      { form: "Form 1040", what: "U.S. individual income tax return for citizens and resident aliens" },
      { form: "Form 1040-NR", what: "Return for nonresident aliens with U.S.-source income" },
      { form: "Schedules 1–3, A, B, C, D, E", what: "Extra income, itemized deductions, interest and dividends, self-employment, capital gains, rental income" },
      { form: "Form 4868", what: "Automatic six-month extension of time to file (not to pay)" },
    ],
    deadlines: [
      { when: "April 15", what: "Federal return and any tax owed for the previous year" },
      { when: "October 15", what: "Extended deadline to file if Form 4868 was submitted by April 15" },
    ],
    mistakes: [
      "Filing Form 1040 when you are still a nonresident (common for F-1 students), or 1040-NR when you have become a resident",
      "Leaving out income from India or other countries once you are a U.S. tax resident",
      "Missing a 1099 (interest, brokerage, freelance) that the IRS already received",
      "Treating an extension as more time to pay — interest and penalties still apply after April 15",
    ],
    sources: [
      IRS("Form 1040 and instructions", "https://www.irs.gov/forms-pubs/about-form-1040"),
      IRS("Extension of time to file", "https://www.irs.gov/filing/get-an-extension-to-file-your-tax-return"),
      IRS("Publication 519, U.S. Tax Guide for Aliens", "https://www.irs.gov/publications/p519"),
    ],
    guideSlugs: ["h1b-resident-or-nonresident-for-tax", "estimated-tax-payments"],
  },
  "state-tax-filing": {
    forms: [
      { form: "Resident return", what: "For the state you lived in for the whole year" },
      { form: "Part-year resident return", what: "For each state you moved into or out of during the year" },
      { form: "Nonresident return", what: "For a state where you earned income but did not live" },
    ],
    deadlines: [
      { when: "Usually April 15", what: "Most states follow the federal date, but some differ — we check each state you file in" },
    ],
    mistakes: [
      "Filing only in your new state after moving mid-year",
      "Not claiming a credit for tax paid to another state on the same income",
      "Assuming remote work is only taxed where you live — some states tax work done for an employer located there",
    ],
    sources: [IRS("State government websites", "https://www.irs.gov/help/state-government-websites")],
  },
  fbar: {
    forms: [
      { form: "FinCEN Form 114 (FBAR)", what: "Report of Foreign Bank and Financial Accounts, filed online with FinCEN" },
      { form: "FinCEN Form 114a", what: "Authorization when a spouse or preparer files the FBAR for you" },
    ],
    deadlines: [
      { when: "April 15", what: "FBAR for the previous calendar year" },
      { when: "October 15", what: "Automatic extension — no request needed" },
    ],
    mistakes: [
      "Applying the $10,000 limit per account instead of to all foreign accounts combined",
      "Leaving out joint accounts with parents or accounts you can only sign on",
      "Assuming Form 8938 on the tax return replaces the FBAR",
      "Filing only the current year after discovering past missed years",
    ],
    sources: [
      IRS("Report of Foreign Bank and Financial Accounts (FBAR)", "https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar"),
      { label: "FinCEN — Report Foreign Bank and Financial Accounts", url: "https://www.fincen.gov/report-foreign-bank-and-financial-accounts" },
    ],
    guideSlugs: ["fbar-for-indians-in-usa", "fbar-vs-fatca-form-8938", "report-indian-bank-accounts-to-irs"],
  },
  fatca: {
    forms: [
      { form: "Form 8938", what: "Statement of Specified Foreign Financial Assets, attached to your tax return" },
      { form: "Form 8621", what: "Often needed for foreign mutual funds treated as PFICs" },
    ],
    deadlines: [{ when: "With your tax return", what: "April 15, or October 15 with an extension" }],
    mistakes: [
      "Using the wrong threshold — it depends on filing status and whether you live in the U.S. or abroad",
      "Reporting accounts but forgetting foreign shares or funds held directly",
      "Not filing the FBAR as well when foreign accounts exceed $10,000",
    ],
    sources: [
      IRS("Comparison of Form 8938 and FBAR requirements", "https://www.irs.gov/businesses/comparison-of-form-8938-and-fbar-requirements"),
      IRS("FATCA information for individuals", "https://www.irs.gov/businesses/corporations/fatca-information-for-individuals"),
    ],
    guideSlugs: ["fbar-vs-fatca-form-8938", "report-indian-bank-accounts-to-irs"],
  },
  itin: {
    forms: [
      { form: "Form W-7", what: "Application for an ITIN — one per person" },
      { form: "Form 1040 or 1040-NR", what: "The tax return the W-7 is normally attached to" },
    ],
    deadlines: [
      { when: "About 7 weeks", what: "IRS processing time; 9–11 weeks from January 15 to April 30 or for applications from abroad" },
      { when: "December 31", what: "ITINs not used on a federal return for three consecutive years expire at the end of the third year" },
    ],
    mistakes: [
      "Sending photocopies instead of originals or certified copies of identity documents",
      "Applying for an ITIN for someone who is eligible for a Social Security number",
      "Filing a return with an expired ITIN, which can delay refunds and credits",
    ],
    sources: [
      IRS("How do I apply for an ITIN?", "https://www.irs.gov/individuals/how-do-i-apply-for-an-itin"),
      IRS("Instructions for Form W-7", "https://www.irs.gov/instructions/iw7"),
    ],
    guideSlugs: ["itin-for-spouse-and-children"],
  },
  "tax-amendment": {
    forms: [
      { form: "Form 1040-X", what: "Amended U.S. individual income tax return" },
      { form: "State amended return", what: "Usually needed too when the federal change affects state tax" },
    ],
    deadlines: [
      { when: "3 years / 2 years", what: "To claim a refund: within 3 years of filing the original return or 2 years of paying the tax, whichever is later" },
    ],
    mistakes: [
      "Amending for a math error the IRS already corrected",
      "Forgetting to amend the state return as well",
      "Paper-filing when the return could be e-filed (tax years 2022 and later can be e-filed with software)",
    ],
    sources: [IRS("File an amended return", "https://www.irs.gov/filing/file-an-amended-return"), IRS("Instructions for Form 1040-X", "https://www.irs.gov/instructions/i1040x")],
    guideSlugs: ["how-to-amend-a-tax-return"],
  },
  "irs-representation": {
    forms: [
      { form: "Form 2848", what: "Power of attorney, so an authorized professional can represent you before the IRS" },
      { form: "Form 8821", what: "Lets a person you name receive your tax information" },
      { form: "Your notice", what: "The notice number (for example CP2000) tells us what the IRS is asking" },
    ],
    deadlines: [{ when: "The date on the notice", what: "Respond by it to keep your options, including appeal rights" }],
    mistakes: [
      "Ignoring a notice — it usually leads to a bill or further notices",
      "Calling a phone number from a suspicious letter instead of verifying it with the IRS",
      "Paying a CP2000 amount you disagree with instead of replying with documents",
    ],
    sources: [
      IRS("Understanding your IRS notice or letter", "https://www.irs.gov/individuals/understanding-your-irs-notice-or-letter"),
      IRS("Understanding your CP2000 notice", "https://www.irs.gov/individuals/understanding-your-cp2000-series-notice"),
      IRS("About Form 2848", "https://www.irs.gov/forms-pubs/about-form-2848"),
    ],
    guideSlugs: ["what-to-do-after-an-irs-notice"],
  },
  "llc-services": {
    forms: [
      { form: "Schedule C (Form 1040)", what: "Default for a single-member LLC owned by an individual" },
      { form: "Form 1065 + Schedules K-1", what: "Default for an LLC with two or more members (taxed as a partnership)" },
      { form: "Form 8832 / Form 2553", what: "Elections to be taxed as a corporation or an S corporation" },
      { form: "Form SS-4", what: "Application for an Employer Identification Number (EIN)" },
    ],
    deadlines: [
      { when: "March 15", what: "Form 1065 for multi-member LLCs (calendar year)" },
      { when: "April 15", what: "Single-member LLC income on the owner's Form 1040" },
    ],
    mistakes: [
      "Mixing personal and business money, which makes the books and the return harder to support",
      "Missing the March 15 partnership deadline — late Form 1065 penalties apply per member, per month",
      "Electing S corporation status without running payroll for the owner",
    ],
    sources: [IRS("Limited liability company (LLC)", "https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc")],
    guideSlugs: ["llc-tax-filing-explained"],
  },
  "entity-formation": {
    forms: [
      { form: "State formation documents", what: "Articles of organization (LLC) or incorporation (corporation)" },
      { form: "Form SS-4", what: "EIN application" },
      { form: "Form 2553", what: "S corporation election" },
      { form: "Form 8832", what: "Entity classification election" },
    ],
    deadlines: [{ when: "2 months and 15 days", what: "Form 2553 is generally due within 2 months and 15 days of the start of the tax year the election should take effect" }],
    mistakes: [
      "Choosing a structure before estimating profit, payroll and owners' plans",
      "Forming in another state without accounting for registration in the state you operate in",
      "Missing the S corporation election window",
    ],
    sources: [IRS("Business structures", "https://www.irs.gov/businesses/small-businesses-self-employed/business-structures"), IRS("Instructions for Form 2553", "https://www.irs.gov/instructions/i2553")],
    guideSlugs: ["llc-tax-filing-explained"],
  },
  "corporate-tax": {
    forms: [
      { form: "Form 1120", what: "C corporation income tax return" },
      { form: "Form 1120-S", what: "S corporation return, with Schedules K-1 for shareholders" },
      { form: "Form 1065", what: "Partnership return, with Schedules K-1 for partners" },
      { form: "Form 7004", what: "Automatic extension of time to file business returns" },
    ],
    deadlines: [
      { when: "March 15", what: "Form 1120-S and Form 1065 (calendar-year businesses)" },
      { when: "April 15", what: "Form 1120 for calendar-year C corporations" },
      { when: "6 months", what: "Extension with Form 7004 (to file, not to pay)" },
    ],
    mistakes: [
      "Sending K-1s late, which delays owners' personal returns",
      "Not making estimated payments when the corporation expects to owe $500 or more",
      "Books that don't reconcile to bank statements at year-end",
    ],
    sources: [IRS("Instructions for Form 1120", "https://www.irs.gov/instructions/i1120"), IRS("Instructions for Form 1120-S", "https://www.irs.gov/instructions/i1120s"), IRS("Instructions for Form 1065", "https://www.irs.gov/instructions/i1065")],
    guideSlugs: ["llc-tax-filing-explained", "estimated-tax-payments"],
  },
  bookkeeping: {
    forms: [
      { form: "Monthly reconciliations", what: "Bank and card accounts matched to statements" },
      { form: "Profit & loss and balance sheet", what: "The statements your business return is prepared from" },
      { form: "Form 1099-NEC", what: "For contractors you paid during the year" },
    ],
    deadlines: [{ when: "January 31", what: "Form 1099-NEC to contractors and the IRS (next business day if it falls on a weekend)" }],
    mistakes: [
      "Catching up a whole year of books in March",
      "Recording owner draws or loans as expenses",
      "Not collecting Form W-9 from contractors before paying them",
    ],
    sources: [IRS("Recordkeeping", "https://www.irs.gov/businesses/small-businesses-self-employed/recordkeeping"), IRS("Instructions for Forms 1099-MISC and 1099-NEC", "https://www.irs.gov/instructions/i1099mec")],
  },
  payroll: {
    forms: [
      { form: "Form 941", what: "Quarterly federal payroll tax return" },
      { form: "Form 940", what: "Annual federal unemployment (FUTA) tax return" },
      { form: "Forms W-2 and W-3", what: "Annual wage statements to employees and the Social Security Administration" },
    ],
    deadlines: [
      { when: "April 30, July 31, October 31, January 31", what: "Form 941 for each quarter" },
      { when: "January 31", what: "Form 940, and W-2s to employees and the SSA" },
    ],
    mistakes: [
      "Depositing payroll taxes late — deposit schedules (monthly or semiweekly) are set by the IRS",
      "Treating workers as contractors when they should be employees",
      "Forgetting state withholding and unemployment registrations",
    ],
    sources: [IRS("Employment taxes", "https://www.irs.gov/businesses/small-businesses-self-employed/employment-taxes"), IRS("Publication 15 (Circular E)", "https://www.irs.gov/publications/p15")],
  },
  "indian-tax-services": {
    forms: [
      { form: "ITR-2", what: "Indian income tax return for non-residents without business income" },
      { form: "ITR-3", what: "When there is business or professional income" },
      { form: "Form 26AS and AIS", what: "Statements of tax deducted at source and reported transactions" },
      { form: "Form 1040 + FBAR / Form 8938 (U.S. side)", what: "Reporting the same Indian income and accounts in the U.S." },
    ],
    deadlines: [
      { when: "July 31", what: "Usual Indian due date for individuals not requiring an audit (the government sometimes extends it)" },
      { when: "April 15", what: "U.S. return and FBAR for the same income and accounts" },
    ],
    mistakes: [
      "Not filing in India to claim back excess TDS deducted on NRO interest or property sales",
      "Assuming income that is tax-free in India (such as NRE interest) is tax-free in the U.S.",
      "Using the wrong residential status for India — it depends on days spent in India",
    ],
    sources: [
      { label: "Income Tax Department of India — Non-resident individuals", url: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-0" },
      IRS("Foreign tax credit", "https://www.irs.gov/individuals/international-taxpayers/foreign-tax-credit"),
    ],
    guideSlugs: ["report-indian-bank-accounts-to-irs", "fbar-for-indians-in-usa", "h1b-resident-or-nonresident-for-tax"],
  },
};
