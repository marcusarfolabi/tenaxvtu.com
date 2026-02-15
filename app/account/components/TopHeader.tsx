"use client";

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Transition, Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import {
  Menu as MenuIcon,
  Bell,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { formatActivityDate } from "@/util/date";

export default function TopHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { logout, user } = useAuth();
  const { unreadCount, notifications } = useNotifications();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const getCustomInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-foreground/5 bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Mobile Menu Toggle & Logo */}
      <div className="flex flex-1 items-center gap-4 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-foreground/70"
          onClick={onMenuClick}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <Logo />
      </div>

      <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch justify-end items-center">
        <div className="flex items-center gap-x-2 sm:gap-x-4">
          
          {/* THEME TOGGLE MODE - Placed before the bell */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-brand-gold transition-all active:scale-90"
            aria-label="Toggle Theme"
          >
            {mounted && (resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
          </button>

          {/* NOTIFICATION BELL */}
          <Popover className="relative">
            <Popover.Button className="p-2.5 text-foreground/40 hover:text-brand-gold hover:bg-foreground/5 rounded-xl transition-all relative outline-none">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-background">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
            >
              <Popover.Panel className="absolute right-0 z-10 mt-4 w-80 origin-top-right rounded-3xl bg-background p-4 shadow-2xl ring-1 ring-black/5 border border-foreground/5">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-black text-sm uppercase tracking-widest text-foreground">
                    Notifications
                  </h3>
                  <Link href="/account/notifications" className="text-[10px] font-black text-brand-gold hover:opacity-80">
                    CLEAR ALL
                  </Link>
                </div>
                {/* ... rest of notification panel ... */}
                <div className="space-y-2 max-h-80 overflow-y-auto px-1 custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n: any) => (
                      <div key={n.id} className="group p-3 hover:bg-foreground/5 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-brand-gold/20">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-brand-gold shrink-0" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-[11px] font-black text-foreground leading-tight">
                                {n.activity}
                              </p>
                              <span className="text-[9px] font-bold text-foreground/40 uppercase whitespace-nowrap ml-2">
                                {formatActivityDate(n.created_at)}
                              </span>
                            </div>
                            <p className="text-[10px] text-foreground/50 mt-1 flex items-center gap-1">
                              <span className="font-bold text-foreground/70">
                                {n.location?.split(",")[0]}
                              </span>
                              • {n.ip}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="h-8 w-8 text-foreground/10 mb-2" />
                      <p className="text-[11px] font-bold text-foreground/20 uppercase tracking-widest">Clean Slate</p>
                    </div>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <div className="h-6 w-px bg-foreground/10 hidden xs:block" />

          {/* USER DROPDOWN */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center p-0.5 sm:p-1 group outline-none">
              <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-gradient-to-br from-brand-black to-gray-800 flex items-center justify-center text-brand-gold text-[10px] sm:text-xs font-black border-2 border-background shadow-md group-hover:shadow-brand-gold/20 transition-all tracking-tighter">
                {getCustomInitials(user?.name ?? "")}
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
            >
              <Menu.Items className="absolute right-0 z-10 mt-4 w-64 origin-top-right rounded-3xl bg-background p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none border border-foreground/5">
                <div className="px-4 py-3 mb-2 border-b border-foreground/5">
                  <p className="text-xs font-black text-foreground truncate">{user?.name}</p>
                  <p className="text-[10px] font-bold text-foreground/40 truncate">{user?.email}</p>
                </div>

                <Menu.Item>
                  {({ active }) => (
                    <Link href="/account/profile" className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-colors ${active ? "bg-foreground/5 text-foreground" : "text-foreground/60"}`}>
                      <User className="h-4 w-4 text-brand-gold" /> Profile Details
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/account/virtual-accounts" className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-colors ${active ? "bg-foreground/5 text-foreground" : "text-foreground/60"}`}>
                      <Settings className="h-4 w-4 text-brand-gold" /> Virtual Accounts
                    </Link>
                  )}
                </Menu.Item>

                <hr className="my-2 border-foreground/5" />

                <Menu.Item>
                  {({ active }) => (
                    <button onClick={logout} className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-colors ${active ? "bg-red-500/10 text-red-500" : "text-red-500/80"}`}>
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}