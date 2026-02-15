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
    // If the item is the users page, only show if role is NOT customer
    if (item.href === "/account/users") {
      return user?.role !== "customer";
    }
    return true;
  });

return (
    <nav className="flex flex-1 flex-col p-6">
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
                    className={`group flex gap-x-3 rounded-2xl p-3 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20 scale-[1.02]"
                        : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive 
                          ? "text-brand-black" 
                          : "text-foreground/40 group-hover:text-brand-gold"
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
            <Link
              href="/account/virtual-accounts"
              className="group flex gap-x-3 rounded-2xl p-3 text-sm font-bold text-brand-gold hover:bg-brand-gold/10 transition-all active:scale-95"
            >
              <PlusCircle className="h-5 w-5" />
              Top Up Wallet
            </Link>
            
            <Link
              href="/support"
              className="group flex gap-x-3 rounded-2xl p-3 text-sm font-bold text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              <LifeBuoy className="h-5 w-5" />
              Support
            </Link>

            <button
              onClick={logout}
              className="w-full group cursor-pointer flex gap-x-3 rounded-2xl p-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all mt-4 active:scale-95"
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
