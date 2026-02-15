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
  const { user, logout } = useAuth();

  const filteredMenu = ACCOUNT_MENU.filter((item) => {
    const isRestrictedPath =
      item.href === "/account/users" ||  item.href === "/account/users/sales" || item.href === "/account/data/list";

    if (isRestrictedPath) {
      return user?.role !== "customer";
    }

    return true;
  });

  return (
    <nav className="flex flex-col py-6 px-4 bg-background h-full transition-colors duration-300">
      <ul role="list" className="flex flex-1 flex-col gap-y-8">
        <li>
          {/* Main Section Header */}
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-4 ml-2">
            Main Services
          </div>
          <ul role="list" className="-mx-2 space-y-1">
            {filteredMenu.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={`group flex items-center gap-x-3 rounded-2xl p-3 text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20 scale-[1.02]"
                        : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive
                          ? "text-brand-black"
                          : "text-foreground/30 group-hover:text-brand-gold"
                      }`}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>

        {/* Footer Section */}
        <li className="mt-auto">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-4 ml-2">
            Account & Help
          </div>
          <div className="-mx-2 space-y-1">
            {/* Top Up Wallet - Added a subtle border to make it pop more in light mode */}
            <Link
              href="/account/virtual-accounts"
              className="group flex gap-x-3 rounded-2xl p-3 text-sm font-black text-brand-gold bg-brand-gold/5 border border-brand-gold/10 hover:bg-brand-gold/10 transition-all active:scale-95"
            >
              <PlusCircle className="h-5 w-5 text-brand-gold" />
              Top Up Wallet
            </Link>

            <Link
              href="/support"
              className="group flex gap-x-3 rounded-2xl p-3 text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              <LifeBuoy className="h-5 w-5 text-foreground/30 group-hover:text-foreground" />
              Support
            </Link>

            <button
              onClick={logout}
              className="w-full group cursor-pointer flex gap-x-3 rounded-2xl p-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all mt-4 active:scale-95"
            >
              <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-600" />
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
}
