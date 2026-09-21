import type { Faq } from "./faqs";

export type ServiceCategory = "tax" | "business" | "international";

export type Service = {
  slug: string;
  category: ServiceCategory;
  name: string;
  icon: string;
  /** Short card description */
  summary: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  hero: { eyebrow: string; title: string; subtitle: string };
  problem: { title: string; points: string[] };
  explanation: { title: string; body: string[]; includes: string[] };
  whoNeedsIt: string[];
  process: { title: string; body: string }[];
  documents: string[];
  faqs: Faq[];
  related: string[];
  /** Value used to pre-select the service in lead forms */
  leadValue: string;
};

const standardProcess = (review: string, file: string): Service["process"] => [
  { title: "Tell us about your situation", body: "Share a few details online or by phone so we understand what you need." },
  { title: "Upload your documents", body: "Send your documents through our secure upload — from your phone or computer." },
  { title: "Professional review", body: review },
  { title: "File & track", body: file },
];

export const services: Service[] = [
  {
    slug: "federal-tax-filing",
    category: "tax",
    name: "Federal Tax Filing",
    icon: "FileText",
    summary: "Professional preparation and e-filing of your federal individual income tax return.",
    metaTitle: "Federal Tax Filing & Preparation Services",
    metaDescription:
      "Professional federal income tax preparation and e-filing for W-2 employees, 1099 contractors, H-1B and visa holders, and families. Get started with Elite Tax Services.",
    keywords: ["federal tax filing", "U.S. tax preparation", "1040 tax preparer", "1040-NR", "tax filing for H-1B"],
    hero: {
      eyebrow: "Individual tax preparation",
      title: "Federal tax filing, handled by professionals.",
      subtitle:
        "We prepare and e-file your federal return accurately — so you know what you owe, what you're getting back, and that it was done right.",
    },
    problem: {
      title: "Filing on your own can get complicated fast",
      points: [
        "Multiple W-2s, 1099s, or a job change mid-year",
        "Unsure whether to file as resident or nonresident (1040 vs. 1040-NR)",
        "Missing out on credits and deductions you qualify for",
        "Worried about errors that trigger IRS letters later",
      ],
    },
    explanation: {
      title: "What our federal filing service covers",
      body: [
        "Elite Tax Services is a registered Electronic Return Originator (ERO) with the IRS. Your return is prepared by tax professionals and reviewed before it is filed.",
        "We look at your full picture — income, dependents, credits, deductions and residency status — to prepare a complete and accurate return.",
      ],
      includes: [
        "Form 1040 and 1040-NR preparation",
        "E-filing or paper filing where required",
        "Filing extensions (Form 4868)",
        "W-4 withholding review",
        "Prior-year and late returns",
        "Individual retirement planning conversations",
      ],
    },
    whoNeedsIt: [
      "W-2 employees, including those with multiple employers",
      "1099 contractors, freelancers and gig workers",
      "H-1B, L-1, F-1 (OPT) and other visa holders",
      "Families claiming dependents and education credits",
      "Anyone with rental, investment or foreign income",
    ],
    process: standardProcess(
      "A tax professional prepares your return and reviews it with you before anything is filed.",
      "Once you approve, we e-file your return and share confirmation so you can track its status.",
    ),
    documents: [
      "Photo ID and Social Security Number or ITIN for everyone on the return",
      "W-2s from all employers",
      "1099 forms (NEC, MISC, INT, DIV, B, R, G)",
      "Form 1098 (mortgage interest) and property tax records",
      "Education forms (1098-T) and student loan interest (1098-E)",
      "Last year's tax return, if available",
      "Bank details for direct deposit of your refund",
    ],
    faqs: [
      { q: "When is the federal filing deadline?", a: "For most individuals the federal deadline is April 15. An extension (Form 4868) gives you until October 15 to file, but any tax owed is still due by April 15." },
      { q: "Can you file returns for previous years?", a: "Yes. We can prepare prior-year and late returns. Filing sooner can limit penalties and interest, and you generally have three years to claim a refund." },
      { q: "Do you prepare returns for nonresidents?", a: "Yes. We help determine your residency status and prepare Form 1040-NR when it applies, including for many visa holders." },
      { q: "Will I see my return before it's filed?", a: "Yes. We review the return with you and file only after you approve it." },
    ],
    related: ["state-tax-filing", "tax-amendment", "fbar"],
    leadValue: "federal-tax-filing",
  },
  {
    slug: "state-tax-filing",
    category: "tax",
    name: "State Tax Filing",
    icon: "MapPin",
    summary: "State-specific filing for residents, part-year residents and multi-state earners.",
    metaTitle: "State Tax Filing Services — Resident, Part-Year & Multi-State",
    metaDescription:
      "State income tax return preparation for residents, part-year residents and multi-state filers. Moved or worked in more than one state? Elite Tax Services can help.",
    keywords: ["state tax filing", "multi-state tax return", "part-year resident tax", "state income tax preparation"],
    hero: {
      eyebrow: "State returns",
      title: "State tax filing, without the guesswork.",
      subtitle:
        "Moved, worked remotely, or earned income in more than one state? We prepare the right state returns and help you avoid being taxed twice.",
    },
    problem: {
      title: "State rules vary more than most people expect",
      points: [
        "You moved states during the year",
        "You live in one state and work in another",
        "Your employer withheld tax for the wrong state",
        "You're not sure which states you need to file in",
      ],
    },
    explanation: {
      title: "How we handle your state return",
      body: [
        "Each state has its own rules for residency, income sourcing and credits. We determine which states you need to file in and prepare each return alongside your federal return.",
        "For multi-state situations, we apply credits for taxes paid to other states where available so the same income isn't taxed twice.",
      ],
      includes: [
        "Resident state returns",
        "Part-year and nonresident state returns",
        "Multi-state income allocation",
        "Credits for taxes paid to other states",
        "Local and city returns where required",
        "State amendments and notices",
      ],
    },
    whoNeedsIt: [
      "Anyone who lived or earned income in a state with an income tax",
      "People who moved to a new state during the year",
      "Remote workers whose employer is in another state",
      "Contractors with clients in multiple states",
    ],
    process: standardProcess(
      "We confirm your residency timeline and prepare each state return alongside your federal return.",
      "We file your state returns and keep you updated on acceptance and refund status.",
    ),
    documents: [
      "W-2s showing state wages and state withholding",
      "Dates you moved in or out of a state",
      "Lease, closing or utility records if residency is unclear",
      "1099 forms for income earned in each state",
      "Last year's state return, if available",
    ],
    faqs: [
      { q: "Do I need to file in more than one state?", a: "Possibly. If you moved, or earned income sourced to another state, you may need a part-year or nonresident return. We'll confirm exactly which returns you need." },
      { q: "Will I be taxed twice on the same income?", a: "Most states offer a credit for taxes paid to another state. We apply these credits where they are available." },
      { q: "My state doesn't have an income tax. Do I need to file?", a: "Usually not for that state, but you may still need to file in another state where you earned income. We'll check." },
    ],
    related: ["federal-tax-filing", "tax-amendment", "irs-representation"],
    leadValue: "state-tax-filing",
  },
  {
    slug: "fbar",
    category: "international",
    name: "FBAR Filing",
    icon: "Globe2",
    summary: "FinCEN Form 114 reporting for foreign bank and financial accounts.",
    metaTitle: "FBAR Filing Services (FinCEN Form 114)",
    metaDescription:
      "Need to report foreign bank accounts? Elite Tax Services prepares and files FBAR (FinCEN Form 114) for U.S. persons with foreign accounts, including NRIs with Indian accounts.",
    keywords: ["FBAR filing", "FinCEN 114", "foreign bank account report", "FBAR for NRI", "report Indian bank account"],
    hero: {
      eyebrow: "International reporting",
      title: "FBAR filing for your foreign accounts.",
      subtitle:
        "If your foreign accounts added up to more than $10,000 at any point in the year, you may need to file an FBAR. We'll help you report them correctly.",
    },
    problem: {
      title: "Foreign account reporting is easy to miss",
      points: [
        "You have NRE, NRO or savings accounts in India or another country",
        "You didn't know FBAR applied to you in previous years",
        "You need to convert balances using the correct exchange rates",
        "You have signature authority over a family or business account",
      ],
    },
    explanation: {
      title: "What an FBAR is and how we help",
      body: [
        "The Report of Foreign Bank and Financial Accounts (FBAR), FinCEN Form 114, is filed electronically with the U.S. Treasury's Financial Crimes Enforcement Network — separately from your tax return.",
        "A U.S. person generally must file if the combined maximum value of their foreign financial accounts exceeded $10,000 at any time during the calendar year. We gather your account details, calculate maximum values and file the report for you.",
      ],
      includes: [
        "Determining whether you need to file",
        "Maximum account value calculations",
        "Currency conversion using Treasury rates",
        "FinCEN Form 114 electronic filing",
        "Joint and signature-authority accounts",
        "Help with late or missed prior-year FBARs",
      ],
    },
    whoNeedsIt: [
      "U.S. citizens, green card holders and residents with foreign accounts",
      "NRIs and H-1B holders who kept bank accounts in India",
      "People with foreign mutual funds, deposits or insurance with cash value",
      "Anyone with signature authority over a foreign account",
    ],
    process: standardProcess(
      "We review each account, determine the highest balance during the year and convert it to U.S. dollars.",
      "We file your FBAR electronically and share the BSA filing confirmation for your records.",
    ),
    documents: [
      "List of all foreign bank, brokerage and investment accounts",
      "Bank name, address and account number for each account",
      "Statements showing the highest balance during the year",
      "Account ownership type (individual, joint, signature authority)",
      "Prior-year FBAR confirmations, if any",
    ],
    faqs: [
      { q: "What is the FBAR threshold?", a: "You generally need to file if the combined maximum value of all your foreign financial accounts exceeded $10,000 at any time during the calendar year — even if each account was smaller." },
      { q: "When is the FBAR due?", a: "The FBAR is due April 15, with an automatic extension to October 15. No separate extension request is required." },
      { q: "Is FBAR the same as FATCA?", a: "No. FBAR (FinCEN Form 114) is filed with FinCEN. FATCA reporting (Form 8938) is filed with your tax return and has different thresholds. Some people need to file both." },
      { q: "I missed FBARs in earlier years. What should I do?", a: "Talk to us. There are IRS procedures for late filings, and the right path depends on your situation. We'll help you understand your options." },
    ],
    related: ["fatca", "indian-tax-services", "federal-tax-filing"],
    leadValue: "fbar",
  },
  {
    slug: "fatca",
    category: "international",
    name: "FATCA Reporting",
    icon: "Landmark",
    summary: "Form 8938 reporting of specified foreign financial assets with your tax return.",
    metaTitle: "FATCA Reporting Services (Form 8938)",
    metaDescription:
      "FATCA Form 8938 preparation for U.S. taxpayers with foreign financial assets. Elite Tax Services helps you determine whether you meet the thresholds and report correctly.",
    keywords: ["FATCA filing", "Form 8938", "foreign asset reporting", "FATCA for NRI"],
    hero: {
      eyebrow: "International reporting",
      title: "FATCA reporting, done correctly.",
      subtitle:
        "If your foreign financial assets are above the FATCA thresholds, you'll need to report them on Form 8938 with your tax return. We make it clear.",
    },
    problem: {
      title: "FATCA and FBAR are often confused",
      points: [
        "Different thresholds apply depending on filing status and where you live",
        "Some assets are reportable for FATCA but not FBAR — and vice versa",
        "Foreign mutual funds and insurance policies can raise extra questions",
        "Penalties can apply for failing to file",
      ],
    },
    explanation: {
      title: "How FATCA reporting works",
      body: [
        "The Foreign Account Tax Compliance Act requires certain U.S. taxpayers to report specified foreign financial assets on Form 8938, filed with their annual income tax return.",
        "For single filers living in the U.S., reporting generally applies when foreign assets exceed $50,000 on the last day of the year or $75,000 at any time during the year. Thresholds are higher for joint filers and for taxpayers living abroad.",
      ],
      includes: [
        "Threshold analysis based on your filing status",
        "Form 8938 preparation with your return",
        "Coordination with your FBAR filing",
        "Foreign income reporting on your return",
        "Foreign tax credit review (Form 1116)",
      ],
    },
    whoNeedsIt: [
      "U.S. taxpayers with significant foreign bank or investment accounts",
      "NRIs with Indian fixed deposits, mutual funds or shares",
      "People holding interests in foreign entities or foreign pensions",
      "Taxpayers who also file FBAR and want both handled together",
    ],
    process: standardProcess(
      "We identify reportable assets, test them against your threshold and coordinate with your FBAR.",
      "Form 8938 is filed with your tax return, and we give you a summary for your records.",
    ),
    documents: [
      "Year-end and highest balances for each foreign account",
      "Foreign investment, mutual fund and share statements",
      "Details of foreign pensions, insurance or entity interests",
      "Foreign income and foreign tax paid",
      "Your FBAR details, if you file one",
    ],
    faqs: [
      { q: "What are the FATCA thresholds?", a: "For single filers living in the U.S., generally more than $50,000 on the last day of the year or $75,000 at any time. For married filing jointly, $100,000 and $150,000. Higher thresholds apply if you live abroad." },
      { q: "Do I file FATCA separately?", a: "No. Form 8938 is attached to your federal income tax return. The FBAR is filed separately with FinCEN." },
      { q: "Do I need both FATCA and FBAR?", a: "Many people with foreign accounts need both. We'll check your thresholds and handle both filings together." },
    ],
    related: ["fbar", "indian-tax-services", "federal-tax-filing"],
    leadValue: "fatca",
  },
  {
    slug: "itin",
    category: "tax",
    name: "ITIN Processing",
    icon: "IdCard",
    summary: "Guidance and preparation for Form W-7 ITIN applications and renewals.",
    metaTitle: "ITIN Application & Renewal Services (Form W-7)",
    metaDescription:
      "Need an ITIN for yourself, your spouse or dependents? Elite Tax Services helps prepare Form W-7 applications and renewals and explains what documents you need.",
    keywords: ["ITIN application", "Form W-7", "ITIN for spouse", "ITIN for dependents", "ITIN renewal"],
    hero: {
      eyebrow: "ITIN services",
      title: "Get clarity on your ITIN application.",
      subtitle:
        "We explain whether you or your family members need an ITIN, prepare Form W-7, and help you get your documents right the first time.",
    },
    problem: {
      title: "ITIN applications are often delayed by small mistakes",
      points: [
        "Not sure whether your spouse or dependents qualify",
        "Unclear which identity documents are accepted",
        "Applications returned for missing information",
        "An existing ITIN has expired from non-use",
      ],
    },
    explanation: {
      title: "What an ITIN is",
      body: [
        "An Individual Taxpayer Identification Number (ITIN) is issued by the IRS to people who need a U.S. taxpayer identification number but are not eligible for a Social Security Number.",
        "ITIN applications are made on Form W-7, generally submitted with a federal tax return and identity documents such as a valid passport. We prepare the application and walk you through document requirements.",
      ],
      includes: [
        "Eligibility review for you, your spouse and dependents",
        "Form W-7 preparation",
        "Tax return preparation to accompany the application",
        "Document checklist and guidance",
        "ITIN renewals",
      ],
    },
    whoNeedsIt: [
      "Spouses and dependents of U.S. visa holders (e.g., H-4 dependents)",
      "Nonresidents with a U.S. tax filing requirement",
      "Foreign investors or property owners with U.S. income",
      "People whose ITIN expired after three years without use on a return",
    ],
    process: standardProcess(
      "We confirm eligibility, prepare Form W-7 and the accompanying tax return, and check your documents.",
      "Your application is submitted and we help you follow up on its status.",
    ),
    documents: [
      "Valid passport (or other accepted identity documents)",
      "Proof of relationship for dependents (e.g., birth certificate)",
      "Visa and U.S. entry details, if applicable",
      "Income documents for the accompanying tax return",
      "Previous ITIN letter, for renewals",
    ],
    faqs: [
      { q: "Who needs an ITIN?", a: "People who need a U.S. taxpayer identification number but aren't eligible for a Social Security Number — for example, a nonresident spouse or dependent claimed on a U.S. return, or a nonresident with a U.S. filing requirement." },
      { q: "How long does an ITIN take?", a: "IRS processing times vary and can be longer during filing season. Submitting a complete application with correct documents helps avoid delays." },
      { q: "Do ITINs expire?", a: "Yes. An ITIN generally expires if it isn't used on a federal tax return for three consecutive years, and some older ITINs have expired on a set schedule. We can help with renewals." },
    ],
    related: ["federal-tax-filing", "fbar", "indian-tax-services"],
    leadValue: "itin",
  },
  {
    slug: "tax-amendment",
    category: "tax",
    name: "Tax Amendments",
    icon: "FilePen",
    summary: "Correct errors or missed items on a previously filed return with Form 1040-X.",
    metaTitle: "Tax Amendment Services — File an Amended Return (1040-X)",
    metaDescription:
      "Made a mistake on a filed tax return? Elite Tax Services prepares amended federal (1040-X) and state returns to correct errors, add missed income or claim credits.",
    keywords: ["amend tax return", "1040-X", "amended tax return help", "correct tax return"],
    hero: {
      eyebrow: "Amended returns",
      title: "Fix your tax return the right way.",
      subtitle:
        "Missed a form, used the wrong filing status, or forgot a credit? We prepare amended returns to correct it — federal and state.",
    },
    problem: {
      title: "Common reasons people need to amend",
      points: [
        "A corrected W-2 or 1099 arrived after you filed",
        "Wrong filing status or residency status",
        "Missed deductions, credits or dependents",
        "Unreported income flagged by the IRS",
      ],
    },
    explanation: {
      title: "How amending works",
      body: [
        "An amended federal return is filed on Form 1040-X and shows the original figures, the corrected figures and an explanation of the change. Most states have their own amendment process.",
        "Generally, you can claim a refund with an amended return within three years of filing the original return or two years of paying the tax, whichever is later.",
      ],
      includes: [
        "Review of your original return",
        "Form 1040-X preparation",
        "Amended state returns",
        "Residency status corrections (1040 vs. 1040-NR)",
        "Coordination with any related IRS notice",
      ],
    },
    whoNeedsIt: [
      "Anyone who received corrected tax forms after filing",
      "Taxpayers who filed with the wrong status",
      "People who missed credits or deductions",
      "Visa holders who filed the wrong return type",
    ],
    process: standardProcess(
      "We compare your original return with the corrected information and prepare the amendment.",
      "We file the amended return and help you track it — amendments typically take longer to process.",
    ),
    documents: [
      "Copy of the original filed return",
      "Corrected or newly received tax forms",
      "Any IRS or state notice you received",
      "Supporting documents for the change",
    ],
    faqs: [
      { q: "How long do I have to amend?", a: "To claim a refund, generally within three years from the date you filed the original return or within two years from the date you paid the tax, whichever is later." },
      { q: "How long does an amended return take to process?", a: "Amended returns usually take longer than original returns. The IRS provides a 'Where's My Amended Return?' tool to track status." },
      { q: "Do I need to amend my state return too?", a: "Often, yes — if the change affects your state taxable income. We'll handle both." },
    ],
    related: ["federal-tax-filing", "irs-representation", "state-tax-filing"],
    leadValue: "tax-amendment",
  },
  {
    slug: "irs-representation",
    category: "tax",
    name: "IRS Representation",
    icon: "ShieldCheck",
    summary: "Help responding to IRS notices and support through the audit process.",
    metaTitle: "IRS Notice & Audit Representation Services",
    metaDescription:
      "Received an IRS notice or audit letter? Elite Tax Services helps you understand it, prepare a response and supports you through the audit process.",
    keywords: ["IRS representation", "IRS notice help", "IRS audit help", "CP2000 response"],
    hero: {
      eyebrow: "IRS notices & audits",
      title: "Got an IRS letter? Don't face it alone.",
      subtitle:
        "We help you understand what the IRS is asking, prepare a clear response, and support you through the audit process if your return is selected.",
    },
    problem: {
      title: "IRS letters are stressful — and they have deadlines",
      points: [
        "A notice proposing changes to your return (like a CP2000)",
        "A balance due you don't understand",
        "A request for documents or an audit letter",
        "Worry about responding the wrong way",
      ],
    },
    explanation: {
      title: "How we help",
      body: [
        "Most IRS notices are about a specific item and include a response deadline. We review the notice against your return, explain what it means and prepare a response with supporting documentation.",
        "If your return is selected for audit, we assist you through the process. Where authorized representation is needed, it is handled by a qualified professional under a signed power of attorney (Form 2848).",
      ],
      includes: [
        "Notice review and plain-English explanation",
        "Response preparation and documentation",
        "Audit assistance",
        "Amended returns when a correction is needed",
        "Payment plan guidance for balances due",
      ],
    },
    whoNeedsIt: [
      "Anyone who received an IRS or state tax notice",
      "Taxpayers whose return was selected for audit",
      "People with an unexpected balance due",
      "Businesses with payroll or filing notices",
    ],
    process: [
      { title: "Share your notice", body: "Upload a copy of the notice — every page — so we can see exactly what's being asked." },
      { title: "Review & explain", body: "We compare the notice with your return and explain what it means and your options." },
      { title: "Prepare the response", body: "We prepare a response with the right supporting documents before the deadline." },
      { title: "Follow through", body: "We help you track the outcome and handle any follow-up correspondence." },
    ],
    documents: [
      "The IRS or state notice (all pages)",
      "The tax return the notice refers to",
      "Supporting records related to the issue",
      "Any previous correspondence with the IRS",
    ],
    faqs: [
      { q: "What should I do first when I get an IRS notice?", a: "Don't ignore it. Read the response deadline, keep the notice, and contact us with a copy so we can review it before the deadline." },
      { q: "Does a notice mean I'm being audited?", a: "Not necessarily. Many notices are automated and relate to a single item, like unreported income or a math correction." },
      { q: "Can you speak to the IRS for me?", a: "With a signed power of attorney (Form 2848), a qualified professional can communicate with the IRS on your behalf." },
    ],
    related: ["tax-amendment", "federal-tax-filing", "corporate-tax"],
    leadValue: "irs-representation",
  },
  {
    slug: "llc-services",
    category: "business",
    name: "LLC Services",
    icon: "Building2",
    summary: "LLC formation, EIN setup and ongoing LLC tax filings.",
    metaTitle: "LLC Formation & LLC Tax Services",
    metaDescription:
      "Start and run your LLC with confidence. Elite Tax Services helps with LLC formation, EIN applications, tax classification and LLC tax filings, including foreign-owned LLCs.",
    keywords: ["LLC tax services", "LLC formation", "Delaware LLC", "foreign-owned LLC Form 5472", "LLC S corp election"],
    hero: {
      eyebrow: "Limited liability companies",
      title: "Start your LLC. Stay compliant.",
      subtitle:
        "From formation and EIN to annual tax filings, we help you set up your LLC properly and keep it in good standing.",
    },
    problem: {
      title: "Setting up an LLC raises tax questions early",
      points: [
        "Which state should you form in?",
        "How will the LLC be taxed — and should you elect S corp status?",
        "Do you need an EIN, and how do you get one?",
        "Foreign-owned LLCs have additional reporting requirements",
      ],
    },
    explanation: {
      title: "What an LLC is",
      body: [
        "A limited liability company combines elements of sole proprietorships and corporations, offering liability protection with flexible tax treatment.",
        "By default, a single-member LLC is treated as a disregarded entity and a multi-member LLC as a partnership, but an LLC can elect to be taxed as an S corporation or C corporation. We help you choose and file accordingly.",
      ],
      includes: [
        "LLC formation filings",
        "EIN application",
        "Tax classification and S corp election (Form 2553)",
        "Annual LLC tax returns (Schedule C, 1065, 1120-S)",
        "Form 5472 for foreign-owned single-member LLCs",
        "Bookkeeping and payroll setup",
      ],
    },
    whoNeedsIt: [
      "Freelancers and consultants formalizing their business",
      "New small businesses and startups",
      "Non-U.S. residents and NRIs forming a U.S. LLC",
      "Existing LLC owners who need annual filings",
    ],
    process: standardProcess(
      "We recommend a structure and tax classification, prepare formation filings and apply for your EIN.",
      "You receive your formation documents and EIN, and we set up a calendar for your ongoing filings.",
    ),
    documents: [
      "Proposed LLC name and state of formation",
      "Member names, addresses and ownership percentages",
      "SSN or ITIN of the responsible party (if available)",
      "Passport copy for non-U.S. members",
      "Business address and description of activities",
    ],
    faqs: [
      { q: "How is an LLC taxed?", a: "By default, a single-member LLC is disregarded (reported on the owner's return) and a multi-member LLC files as a partnership. An LLC can elect to be taxed as an S or C corporation." },
      { q: "Can a non-U.S. resident form a U.S. LLC?", a: "Yes. Foreign-owned single-member LLCs typically must file Form 5472 with a pro forma Form 1120 each year. We can help with formation and filings." },
      { q: "Should my LLC elect S corp status?", a: "It depends on your profit level, payroll and goals. We'll walk through the trade-offs with you." },
    ],
    related: ["entity-formation", "corporate-tax", "bookkeeping"],
    leadValue: "llc-services",
  },
  {
    slug: "entity-formation",
    category: "business",
    name: "Entity Formation",
    icon: "Network",
    summary: "Choose and set up the right business structure for your goals.",
    metaTitle: "Business Entity Formation Services",
    metaDescription:
      "LLC, S corporation, C corporation or partnership? Elite Tax Services helps you choose the most suitable business structure and sets it up with the right tax elections.",
    keywords: ["entity formation", "business formation", "S corp vs LLC", "C corporation formation"],
    hero: {
      eyebrow: "Business structure",
      title: "Start your business on the right foundation.",
      subtitle:
        "Your entity type affects taxes, liability and paperwork for years. We help you choose the most suitable structure and set it up properly.",
    },
    problem: {
      title: "The wrong structure can cost you later",
      points: [
        "Paying more self-employment tax than necessary",
        "Personal liability exposure",
        "Structures that don't fit investors or partners",
        "Missed election deadlines",
      ],
    },
    explanation: {
      title: "Picking the right entity",
      body: [
        "We compare sole proprietorships, LLCs, partnerships, S corporations and C corporations based on your income, number of owners, growth plans and residency of owners.",
        "Once you decide, we help with formation filings, EIN, tax elections and your first-year compliance calendar.",
      ],
      includes: [
        "Entity comparison for your situation",
        "LLC, corporation and partnership formation",
        "EIN application",
        "S corp (2553) and entity classification (8832) elections",
        "First-year compliance calendar",
      ],
    },
    whoNeedsIt: [
      "First-time founders and small business owners",
      "Freelancers growing into a business",
      "Partners starting a company together",
      "International founders entering the U.S.",
    ],
    process: standardProcess(
      "We recommend a structure, then prepare the formation filings and tax elections.",
      "You receive your documents, EIN and a clear list of upcoming filing dates.",
    ),
    documents: [
      "Business name options and state",
      "Owner details and ownership split",
      "Expected revenue and business activity",
      "Owner identification documents",
    ],
    faqs: [
      { q: "LLC or corporation — which is better?", a: "Neither is best for everyone. It depends on your income, owners, investors and plans. We'll compare them for your situation." },
      { q: "Can I change my entity later?", a: "Often, yes — through tax elections or conversions — but some changes have tax consequences, so it helps to start right." },
    ],
    related: ["llc-services", "corporate-tax", "payroll"],
    leadValue: "entity-formation",
  },
  {
    slug: "corporate-tax",
    category: "business",
    name: "Corporate Tax Filing",
    icon: "Briefcase",
    summary: "Preparation of C corporation, S corporation and partnership tax returns.",
    metaTitle: "Corporate Tax Filing Services — 1120, 1120-S & 1065",
    metaDescription:
      "Business tax return preparation for C corporations (1120), S corporations (1120-S) and partnerships (1065), including extensions and state filings.",
    keywords: ["corporate tax filing", "Form 1120", "1120-S preparation", "partnership return 1065", "business tax preparation"],
    hero: {
      eyebrow: "Business tax returns",
      title: "Corporate tax filing, on time and accurate.",
      subtitle:
        "We prepare federal and state returns for corporations and partnerships — and keep your deadlines, extensions and K-1s organized.",
    },
    problem: {
      title: "Business returns come with tight deadlines",
      points: [
        "S corporation and partnership returns are due earlier than personal returns",
        "Books that aren't ready by tax time",
        "Owners waiting on K-1s to file their own returns",
        "Multi-state filing obligations",
      ],
    },
    explanation: {
      title: "What we prepare",
      body: [
        "For calendar-year businesses, partnership (1065) and S corporation (1120-S) returns are generally due March 15, and C corporation (1120) returns April 15. Form 7004 can extend the filing deadline.",
        "We work from your books — or help get them in order first — to prepare accurate business returns and owner K-1s.",
      ],
      includes: [
        "Form 1120 (C corporation)",
        "Form 1120-S (S corporation) and K-1s",
        "Form 1065 (partnership) and K-1s",
        "Extensions (Form 7004)",
        "State business returns",
        "Business tax planning",
      ],
    },
    whoNeedsIt: [
      "C corporations and S corporations",
      "Multi-member LLCs and partnerships",
      "Foreign-owned U.S. entities",
      "Businesses behind on prior-year filings",
    ],
    process: standardProcess(
      "We review your financial statements, prepare the return and K-1s, and walk you through the results.",
      "We file federal and state returns and share copies and next-year planning notes.",
    ),
    documents: [
      "Profit & loss statement and balance sheet",
      "Bank and credit card statements",
      "Payroll reports and 1099s issued",
      "Asset purchases and depreciation schedules",
      "Prior-year business return",
    ],
    faqs: [
      { q: "When are business returns due?", a: "For calendar-year entities: partnerships and S corporations generally by March 15, C corporations by April 15. Form 7004 extends the time to file." },
      { q: "Can you help if my books aren't ready?", a: "Yes. Our bookkeeping team can clean up and reconcile your books before we prepare the return." },
    ],
    related: ["bookkeeping", "payroll", "llc-services"],
    leadValue: "corporate-tax",
  },
  {
    slug: "bookkeeping",
    category: "business",
    name: "Bookkeeping",
    icon: "BookOpen",
    summary: "Accurate, reconciled books that make tax time simple.",
    metaTitle: "Small Business Bookkeeping Services",
    metaDescription:
      "Monthly bookkeeping, reconciliations and financial statements for small businesses. Tax-ready books from Elite Tax Services.",
    keywords: ["bookkeeping services", "small business bookkeeping", "catch-up bookkeeping", "monthly reconciliation"],
    hero: {
      eyebrow: "Bookkeeping",
      title: "Clean books. Clear decisions.",
      subtitle:
        "We keep your books accurate and reconciled every month, so you always know where your business stands — and tax time is simple.",
    },
    problem: {
      title: "Messy books create problems at tax time",
      points: [
        "Months of uncategorized transactions",
        "Bank accounts that don't reconcile",
        "Missed deductions from poor records",
        "No clear view of profit and cash flow",
      ],
    },
    explanation: {
      title: "What's included",
      body: [
        "Our team has over a decade of experience with business bookkeeping, taxation and payroll. We categorize transactions, reconcile your accounts and deliver regular financial statements.",
        "Because bookkeeping and tax sit under one roof, your books are prepared with your tax return in mind.",
      ],
      includes: [
        "Transaction categorization",
        "Bank and credit card reconciliation",
        "Monthly profit & loss and balance sheet",
        "Catch-up and clean-up bookkeeping",
        "Year-end tax-ready books",
      ],
    },
    whoNeedsIt: [
      "Small businesses and startups",
      "LLCs and self-employed professionals",
      "Businesses behind on their books",
      "Owners who want monthly financial clarity",
    ],
    process: standardProcess(
      "We set up or review your books, then reconcile and categorize each month.",
      "You receive regular financial statements and year-end books ready for your tax return.",
    ),
    documents: [
      "Access to bank and credit card statements",
      "Accounting software access (if any)",
      "Sales and invoice records",
      "Receipts for major expenses",
      "Loan and asset details",
    ],
    faqs: [
      { q: "Can you catch up on past months?", a: "Yes. We offer catch-up and clean-up bookkeeping to bring your books current." },
      { q: "Which accounting software do you work with?", a: "We work with common small-business accounting tools. Tell us what you use and we'll confirm." },
    ],
    related: ["payroll", "corporate-tax", "llc-services"],
    leadValue: "bookkeeping",
  },
  {
    slug: "payroll",
    category: "business",
    name: "Payroll",
    icon: "Wallet",
    summary: "Payroll processing and payroll tax filings for your team.",
    metaTitle: "Payroll Services & Payroll Tax Filing",
    metaDescription:
      "Payroll processing, payroll tax deposits and filings (941, 940, W-2, 1099) for small businesses. Elite Tax Services keeps your payroll compliant.",
    keywords: ["payroll services", "payroll tax filing", "Form 941", "W-2 preparation", "small business payroll"],
    hero: {
      eyebrow: "Payroll",
      title: "Payroll that runs on time, every time.",
      subtitle:
        "We handle payroll processing and payroll tax filings so your team gets paid correctly and your business stays compliant.",
    },
    problem: {
      title: "Payroll mistakes are costly",
      points: [
        "Late payroll tax deposits and penalties",
        "Quarterly and annual forms that are easy to miss",
        "Multi-state employee withholding",
        "Year-end W-2s and 1099s",
      ],
    },
    explanation: {
      title: "What's included",
      body: [
        "We process payroll on your schedule and prepare the federal and state payroll tax filings that go with it.",
        "For S corporation owners, we also help set up reasonable owner compensation through payroll.",
      ],
      includes: [
        "Payroll processing",
        "Quarterly Form 941 and annual Form 940",
        "State payroll and unemployment filings",
        "Year-end W-2 and 1099 preparation",
        "New hire setup and W-4 guidance",
      ],
    },
    whoNeedsIt: [
      "Businesses with employees",
      "S corporation owners paying themselves",
      "Companies hiring contractors (1099)",
      "Businesses with employees in multiple states",
    ],
    process: standardProcess(
      "We set up your payroll, confirm tax accounts and review each run before it's processed.",
      "Payroll is processed and filings are made on schedule, with reports for your records.",
    ),
    documents: [
      "EIN and state payroll account numbers",
      "Employee W-4s and state withholding forms",
      "Pay rates and pay schedule",
      "Prior payroll reports (if switching providers)",
    ],
    faqs: [
      { q: "Can you handle payroll for just one employee?", a: "Yes — including S corporation owners who are the only employee." },
      { q: "Do you file W-2s and 1099s?", a: "Yes. We prepare and file year-end W-2s for employees and 1099s for contractors." },
    ],
    related: ["bookkeeping", "corporate-tax", "entity-formation"],
    leadValue: "payroll",
  },
  {
    slug: "indian-tax-services",
    category: "international",
    name: "Indian Tax Services",
    icon: "Globe",
    summary: "Indian income tax filing for NRIs and residents, supported by our dedicated India team.",
    metaTitle: "Indian Tax Services in the USA — NRI Tax Filing",
    metaDescription:
      "Indian income tax return filing for NRIs living in the USA and for residents of India, with U.S. FBAR/FATCA coordination. Elite Tax Services — U.S. + India tax support under one roof.",
    keywords: ["NRI tax services", "Indian tax services USA", "NRI income tax return", "India tax filing from USA", "DTAA India USA"],
    hero: {
      eyebrow: "U.S. + India",
      title: "Indian tax filing, from wherever you are.",
      subtitle:
        "Our dedicated India processing team helps NRIs and Indian residents file income tax returns in India — coordinated with your U.S. taxes.",
    },
    problem: {
      title: "Two countries, two tax systems",
      points: [
        "Rental income, interest or capital gains from India",
        "TDS deducted at higher rates on NRI income",
        "Questions about the India–U.S. tax treaty (DTAA)",
        "Keeping Indian and U.S. reporting consistent",
      ],
    },
    explanation: {
      title: "How we help with Indian taxes",
      body: [
        "Elite Tax Services supports U.S.-based clients who need to file Indian tax returns, as well as Indian clients with tax obligations in India. Individuals generally must file an Indian return when their total income exceeds the basic exemption limit.",
        "For NRIs, income earned or received in India — such as rent, interest on NRO deposits or capital gains — is generally taxable in India. We prepare your Indian return and help you coordinate it with your U.S. filing, including foreign tax credits and FBAR/FATCA reporting of Indian accounts.",
      ],
      includes: [
        "Indian income tax return (ITR) filing",
        "NRI tax support and residency status review",
        "TDS review and refund claims",
        "Capital gains on Indian property and investments",
        "DTAA and foreign tax credit coordination",
        "FBAR / FATCA reporting of Indian accounts in the U.S.",
      ],
    },
    whoNeedsIt: [
      "NRIs in the U.S. with income from India",
      "H-1B and green card holders with Indian bank accounts or property",
      "Returning Indians and people with residency changes",
      "Residents of India with tax filing obligations",
    ],
    process: standardProcess(
      "Our India team reviews your Indian income and TDS, and our U.S. team checks how it affects your U.S. return.",
      "We file your Indian return and share acknowledgements, with U.S. reporting coordinated where needed.",
    ),
    documents: [
      "PAN card and Aadhaar (if available)",
      "Form 26AS / AIS and Form 16 or 16A (TDS certificates)",
      "NRE / NRO bank statements and interest certificates",
      "Rental income and property sale documents",
      "Mutual fund and share capital gains statements",
      "Passport and travel dates (for residency status)",
    ],
    faqs: [
      { q: "Do NRIs need to file an Indian tax return?", a: "Generally, if your taxable Indian income exceeds the basic exemption limit, or if you want to claim a refund of excess TDS, you should file. We'll review your situation." },
      { q: "Will I be taxed twice on Indian income?", a: "The India–U.S. tax treaty and foreign tax credit rules are designed to reduce double taxation. We coordinate both returns so credits are claimed correctly." },
      { q: "Do I need to report Indian accounts in the U.S.?", a: "If you are a U.S. person, your Indian accounts may need to be reported on the FBAR and/or Form 8938 (FATCA). We handle both sides." },
    ],
    related: ["fbar", "fatca", "federal-tax-filing"],
    leadValue: "indian-tax-services",
  },
];

export const serviceBySlug = new Map(services.map((s) => [s.slug, s]));
export const getService = (slug: string) => serviceBySlug.get(slug);
export const servicesByCategory = (cat: ServiceCategory) => services.filter((s) => s.category === cat);

/** Options used in lead forms. Values are stable keys for CRM mapping. */
export const serviceOptions = [
  { value: "federal-tax-filing", label: "Federal Tax Filing" },
  { value: "state-tax-filing", label: "State Tax Filing" },
  { value: "fbar", label: "FBAR" },
  { value: "fatca", label: "FATCA" },
  { value: "itin", label: "ITIN Processing" },
  { value: "tax-amendment", label: "Tax Amendment" },
  { value: "irs-representation", label: "IRS Notice / Representation" },
  { value: "corporate-tax", label: "Corporate Tax Filing" },
  { value: "llc-services", label: "LLC Services" },
  { value: "entity-formation", label: "Entity Formation" },
  { value: "bookkeeping", label: "Bookkeeping" },
  { value: "payroll", label: "Payroll" },
  { value: "indian-tax-services", label: "Indian / NRI Tax Services" },
  { value: "refund-estimate", label: "Refund Estimate" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const customerTypeOptions = [
  { value: "individual", label: "Individual" },
  { value: "self-employed", label: "Self-employed / 1099" },
  { value: "business", label: "Business owner" },
  { value: "nri", label: "NRI / International" },
] as const;
