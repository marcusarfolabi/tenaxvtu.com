"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LifeBuoy, LogOut, PlusCircle } from "lucide-react";
import { ACCOUNT_MENU } from "@/settings";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  mobile?: boolean;
  closeSidebar?: () => void;
}

export default function Sidebar({
  mobile = false,
  closeSidebar = () => {},
}: SidebarProps) {
  
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="flex flex-1 flex-col p-6">
      <ul role="list" className="flex flex-1 flex-col gap-y-8">
        <li>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-2 opacity-50">
            Main Services
          </div>
          <ul role="list" className="-mx-2 space-y-1">
            {ACCOUNT_MENU.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={`group flex gap-x-3 rounded-2xl p-3 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20 scale-[1.02]"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${isActive ? "text-brand-black" : "group-hover:text-brand-gold"}`}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>

        <li className="mt-auto">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-2 opacity-50">
            Account & Help
          </div>
          <div className="-mx-2 space-y-1">
            <Link
              href="/account/virtual-accounts"
              className="group flex gap-x-3 rounded-2xl p-3 text-sm font-bold text-brand-gold hover:bg-brand-gold/10 transition-all"
            >
              <PlusCircle className="h-5 w-5" />
              Top Up Wallet
            </Link>
            <Link
              href="/support"
              className="group flex gap-x-3 rounded-2xl p-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5"
            >
              <LifeBuoy className="h-5 w-5" />
              Support
            </Link>
            <button
              onClick={logout}
              className="w-full group cursor-pointer flex gap-x-3 rounded-2xl p-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all mt-4 active:scale-[0.98]"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
}
