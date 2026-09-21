export type NavLink = { label: string; href: string; description?: string; icon?: string };
export type NavItem = NavLink & { children?: NavLink[] };

export const taxServiceLinks: NavLink[] = [
  { label: "Federal Tax Filing", href: "/federal-tax-filing", description: "Individual 1040 & 1040-NR returns", icon: "FileText" },
  { label: "State Tax Filing", href: "/state-tax-filing", description: "Resident, part-year & multi-state", icon: "MapPin" },
  { label: "FBAR", href: "/fbar", description: "FinCEN 114 foreign account reports", icon: "Globe2" },
  { label: "FATCA", href: "/fatca", description: "Form 8938 foreign asset reporting", icon: "Landmark" },
  { label: "ITIN Processing", href: "/itin", description: "Form W-7 applications & renewals", icon: "IdCard" },
  { label: "Tax Amendments", href: "/tax-amendment", description: "Correct a filed return (1040-X)", icon: "FilePen" },
  { label: "IRS Representation", href: "/irs-representation", description: "Notices, letters & audit support", icon: "ShieldCheck" },
];

export const businessServiceLinks: NavLink[] = [
  { label: "LLC Services", href: "/llc-services", description: "Formation, EIN & LLC tax filings", icon: "Building2" },
  { label: "Entity Formation", href: "/entity-formation", description: "Choose the right business structure", icon: "Network" },
  { label: "Corporate Tax Filing", href: "/corporate-tax", description: "1120, 1120-S & 1065 returns", icon: "Briefcase" },
  { label: "Bookkeeping", href: "/bookkeeping", description: "Clean, reconciled monthly books", icon: "BookOpen" },
  { label: "Payroll", href: "/payroll", description: "Payroll runs & payroll tax filings", icon: "Wallet" },
];

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Tax Services", href: "/tax-services", children: taxServiceLinks },
  { label: "Business Services", href: "/business-services", children: businessServiceLinks },
  { label: "Indian Tax Services", href: "/indian-tax-services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  {
    label: "Resources",
    href: "/faq",
    children: [
      { label: "FAQs", href: "/faq", description: "Answers to common tax questions", icon: "HelpCircle" },
      { label: "Reviews", href: "/reviews", description: "What clients say about us", icon: "Star" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const primaryCta = { label: "Get Started", href: "/get-started" };
export const secondaryCta = { label: "Talk to a Tax Professional", href: "/contact" };
