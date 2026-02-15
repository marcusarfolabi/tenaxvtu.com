import {
  Smartphone,
  Database,
  Tv,
  Zap,
  GraduationCap,
  History,
  Users
} from "lucide-react";
 
export const MAIN_NAVIGATION = [
  { name: "Services", href: "#services" },
  { name: "About Us", href: "#about" },
  { name: "Privacy", href: "/privacy" },
];

export const FOOTER_NAVIGATION = {
  services: [
    { name: "Data Vending", href: "/login" },
    { name: "Airtime VTU", href: "/login" },
    { name: "Cable Bills", href: "/login" },
    { name: "Electricity Tokens", href: "/login" },
  ],

  company: [
    { name: "About Us", href: "#about" },
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
  { name: "Airtime", href: "/account/airtime", icon: Smartphone },
  { name: "Data Bundle", href: "/account/data", icon: Database },
  { name: "Cable TV", href: "/account/cable", icon: Tv },
  { name: "Electricity", href: "/account/electricity", icon: Zap },
  { name: "Transactions", href: "/account/transactions", icon: History },
  { name: "Customers", href: "/account/users", icon: Users },
];



export const ACCOUNT_QUICK_ACTION_MENU = [
  { name: "Airtime", icon: Smartphone, href: "/account/airtime", color: "bg-blue-50 text-blue-600" },
  { name: "Data", icon: Database, href: "/account/data", color: "bg-purple-50 text-purple-600" },
  { name: "Cable", icon: Tv, href: "/account/cable", color: "bg-orange-50 text-orange-600" },
  { name: "Power", icon: Zap, href: "/account/electricity", color: "bg-yellow-50 text-yellow-600" },
];