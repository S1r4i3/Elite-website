import {
  FileText, MapPin, Globe2, Globe, Landmark, IdCard, FilePen, ShieldCheck, Building2, Network, Briefcase, BookOpen, Wallet,
  Calculator, HelpCircle, Star, RefreshCcw, Rocket, type LucideIcon, Users, Layers, Headphones, Lock, Sparkles, ClipboardList,
  Receipt, FileWarning, FolderUp, UserRound, LineChart,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  FileText, MapPin, Globe2, Globe, Landmark, IdCard, FilePen, ShieldCheck, Building2, Network, Briefcase, BookOpen, Wallet,
  Calculator, HelpCircle, Star, RefreshCcw, Rocket, Users, Layers, Headphones, Lock, Sparkles, ClipboardList, Receipt,
  FileWarning, FolderUp, UserRound, LineChart,
};

export function Icon({ name, className, strokeWidth = 1.75 }: { name: string; className?: string; strokeWidth?: number }) {
  const C = icons[name] ?? FileText;
  return <C className={className} strokeWidth={strokeWidth} aria-hidden />;
}
