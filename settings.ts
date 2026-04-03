import {
  Smartphone,
  Database,
  Tv,
  Zap,
  History,
  Users,
  List,
  WalletCards,
  HomeIcon,
  BarChart3,
  Headphones,
  ShieldCheck,
  GraduationCap,
  Wallet,
  Settings,
  User
} from "lucide-react";
 
export const MAIN_NAVIGATION = [
  { name: "Services", href: "/#services" },
  { name: "About Us", href: "/#features" },
  { name: "Privacy", href: "/privacy" },
  { name: "Support", href: "/support" },
];

export const FOOTER_NAVIGATION = {
  services: [
    { name: "Data Vending", href: "/login" },
    { name: "Airtime VTU", href: "/login" },
    { name: "Cable Bills", href: "/login" },
    { name: "Electricity Tokens", href: "/login" },
  ],

  company: [
    { name: "About Us", href: "/#features" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Agent Program", href: "/register" },
  ],

  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Faqs", href: "/faq" },
  ],
};

export const ACCOUNT_MENU = [
  { name: "Home", href: "/account", icon: HomeIcon },
  { name: "Airtime", href: "/account/airtime", icon: Smartphone },
  { name: "Data", href: "/account/data", icon: Database },
  { name: "Cable", href: "/account/cable", icon: Tv },
  { name: "Power", href: "/account/electricity", icon: Zap }, 
];

export const MENU_CONFIG = {
  common: [
    { href: "/account/profile", icon: User, label: "Profile Details" },
    { href: "/account/virtual-accounts", icon: Settings, label: "Virtual Accounts" },
  ],
  agent: [
    { href: "/account/transactions", icon: History, label: "All Transactions" },
    { href: "/account/users", icon: Users, label: "All Users" },
    { href: "/account/data/list", icon: List, label: "All Data List" },
    { href: "/account/users/sales", icon: WalletCards, label: "All Sales" },
  ],
};

export const ACCOUNT_QUICK_ACTION_MENU = [
  { name: "Airtime", icon: Smartphone, href: "/account/airtime", color: "bg-blue-50 text-blue-600" },
  { name: "Data", icon: Database, href: "/account/data", color: "bg-purple-50 text-purple-600" },
  { name: "Cable", icon: Tv, href: "/account/cable", color: "bg-orange-50 text-orange-600" },
  { name: "Power", icon: Zap, href: "/account/electricity", color: "bg-yellow-50 text-yellow-600" },
];

export const FEATURES = [
  {
    title: "Lightning Fast Delivery",
    desc: "Our automated systems ensure your data and tokens are delivered the micro-second your payment is confirmed.",
    icon: Zap,
    className: "md:col-span-2 bg-brand-red text-white",
    iconColor: "text-white",
    iconBg: "bg-white/20",
  },
  {
    title: "Bank-Grade Security",
    desc: "Your transactions are protected by industry-leading encryption.",
    icon: ShieldCheck,
    className: "md:col-span-1 bg-muted/40 text-foreground",
    iconColor: "text-brand-red",
    iconBg: "bg-brand-red/10",
  },
  {
    title: "24/7 Human Support",
    desc: "Have an issue? Our support team is always online to help you.",
    icon: Headphones,
    className: "md:col-span-1 bg-muted/40 text-foreground",
    iconColor: "text-brand-red",
    iconBg: "bg-brand-red/10",
  },
  {
    title: "Smart Budgeting",
    desc: "Track every kobo you spend on utilities with our simplified transaction history.",
    icon: BarChart3,
    className:
      "md:col-span-2 bg-foreground/5 dark:bg-white/5 text-foreground border-foreground/10",
    iconColor: "text-brand-red",
    iconBg: "bg-brand-red/10",
  },
];

export const SERVICES = [
  {
    title: "Instant Data & VTU",
    desc: "SME and Gifting data for MTN, Airtel, Glo, and 9mobile at wholesale prices.",
    icon: Smartphone,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Electricity Tokens",
    desc: "Instant tokens for Ikeja, Eko, Abuja, and other DISCOs nationwide.",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    title: "Education Pins",
    desc: "Generate WAEC, JAMB, and NECO result checker pins instantly.",
    icon: GraduationCap,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Cable TV & Bills",
    desc: "Renew DSTV, GOTV, and Startimes subscriptions in seconds.",
    icon: Wallet,
    color: "bg-purple-500/10 text-purple-500",
  },
];