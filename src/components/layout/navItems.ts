import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Network, Zap, Users, WalletCards } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/stations", label: "Swap Stations", icon: Network },
  { href: "/swap-monitor", label: "Swap Monitor", icon: Zap },
  { href: "/fleet", label: "Fleet Partners", icon: Users },
  { href: "/wallet", label: "Wallet & Payments", icon: WalletCards },
];
