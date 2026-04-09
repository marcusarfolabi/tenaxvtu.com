"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Menu, Transition, Popover, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useTheme } from "next-themes";
import {
  Menu as MenuIcon,
  Bell, 
  LogOut,
  Sun,
  Moon, 
} from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { formatActivityDate } from "@/util/date";
import { MENU_CONFIG } from "@/settings";
 
const DropdownItem = ({ href, icon: Icon, label, active, variant = "default" }: any) => {
  const styles = variant === "danger"
    ? (active ? "bg-red-500/10 text-red-500" : "text-red-500/80")
    : (active ? "bg-foreground/5 text-foreground" : "text-foreground/60");

  const content = (
    <div className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-colors ${styles}`}>
      <Icon className={`h-4 w-4 ${variant !== "danger" && "text-brand-red"}`} />
      {label}
    </div>
  );
 
  return content;
};

export default function TopHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { logout, user } = useAuth();
  const { unreadCount, notifications } = useNotifications();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const userInitials = useMemo(() => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(/\s+/);
    return parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-foreground/5 bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 transition-colors duration-300">

      <div className="flex flex-1 items-center gap-4 lg:hidden">
        <Logo />
      </div>

      <div className="flex flex-1 gap-x-4 justify-end items-center">

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2.5 cursor-pointer rounded-xl bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-brand-red transition-all"
        >
          {mounted && (resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
        </button>

        {/* NOTIFICATIONS */}
        <Popover className="relative">
          <Popover.Button className="p-2.5 cursor-pointer rounded-xl bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-brand-red transition-all relative">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
            )}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
          >
            <Popover.Panel className="absolute right-0 z-10 mt-4 w-80 rounded-3xl bg-background p-4 shadow-2xl border border-foreground/5">
              <div className="flex justify-between items-center mb-4 px-2 font-black text-xs uppercase tracking-widest">
                <span>Notifications</span>
                <Link href="/account/notifications" className="text-brand-red">Clear All</Link>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto px-1 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n: any) => (
                    <div key={n.id} className="p-3 hover:bg-foreground/5 rounded-2xl transition-all border border-transparent hover:border-brand-red/10 cursor-pointer">
                      <div className="flex gap-3">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-red shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-[11px] font-black leading-tight">{n.activity}</p>
                            <span className="text-[9px] font-bold text-foreground/30 uppercase">{formatActivityDate(n.created_at)}</span>
                          </div>
                          <p className="text-[10px] text-foreground/50 mt-1">{n.location || "System"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-[10px] font-bold text-foreground/20 uppercase tracking-widest">Clean Slate</div>
                )}
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        <div className="h-6 w-px bg-foreground/10 hidden xs:block" />

        {/* USER ACCOUNT MENU */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center p-1 group outline-none">
            <div className="p-2.5 cursor-pointer rounded-full bg-linear-to-br from-brand-black to-gray-800 flex items-center justify-center text-brand-red text-xs font-black border-2 border-background shadow-md transition-all group-hover:scale-105">
              {mounted ? userInitials : "U"}
            </div>
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
          >
            <MenuItems className="absolute right-0 z-10 mt-4 w-64 rounded-3xl bg-background p-2 shadow-2xl border border-foreground/5 focus:outline-none">
              <div className="px-4 py-3 mb-2 border-b border-foreground/5">
                <p className="text-xs font-black truncate">{user?.name}</p>
                <p className="text-[10px] font-bold text-foreground/40 truncate">{user?.email}</p>
              </div>

              {/* Mapped Menu Items */}
               {[
                 ...MENU_CONFIG.common.filter(item =>
                  user?.role === "agent" ? item.href !== "/account/virtual-accounts" : true
                ),
                ...(user?.role === "agent" ? MENU_CONFIG.agent : [])
              ].map((item, i) => (
                <MenuItem key={i}>
                  {({ active }) => (
                    <Link href={item.href}>
                      <DropdownItem active={active} {...item} />
                    </Link>
                  )}
                </MenuItem>
              ))
              }
              <hr className="my-2 border-foreground/5" />

              <MenuItem>
                {({ active }) => (
                  <button className="w-full" onClick={logout}>
                    <DropdownItem active={active} icon={LogOut} label="Sign Out" variant="danger" />
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}