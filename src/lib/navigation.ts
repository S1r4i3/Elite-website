export type NavLink = { label: string; href: string; description?: string; icon?: string; external?: boolean };
export type NavItem = NavLink & { children?: NavLink[] };

export const taxServiceLinks: NavLink[] = [
  { label: "Federal Tax Filing", href: "/federal-tax-filing", description: "Individual 1040 & 1040-NR returns", icon: "FileText" },
  { label: "State Tax Filing", href: "/state-tax-filing", description: "Resident, part-year & multi-state", icon: "MapPin" },
  { label: "FBAR", href: "/fbar", description: "", icon: "Globe2" },
  { label: "FATCA", href: "/fatca", description: "", icon: "Landmark" },
  { label: "ITIN Processing", href: "/itin", description: "", icon: "IdCard" },
  { label: "Tax Amendments", href: "/tax-amendment", description: "", icon: "FilePen" },
  { label: "IRS Representation", href: "/irs-representation", description: "Notices, letters & audit support", icon: "ShieldCheck" },
  { label: "Tax Guides", href: "/guides", description: "FBAR, FATCA & NRI tax explained", icon: "BookOpen" },
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
  { label: "Refund Status", href: "https://sa.www4.irs.gov/wmr/", external: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const primaryCta = { label: "Get Started", href: "/get-started" };
export const secondaryCta = { label: "Talk to a Tax Professional", href: "/contact" };
