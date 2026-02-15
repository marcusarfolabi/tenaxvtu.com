"use client";
import { Fragment } from "react";
import Link from "next/link";
import { Menu, Transition, Popover } from "@headlessui/react";
import {
  Menu as MenuIcon,
  Bell,
  User,
  Settings,
  LogOut,
  Mail,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import Image from "next/image";
import { formatActivityDate } from "@/util/date";

export default function TopHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { logout, user } = useAuth();
  const { unreadCount, notifications } = useNotifications();

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Toggle & Logo */}
      <div className="flex flex-1 items-center gap-4 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={onMenuClick}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <Logo inverted={false} />
      </div>

      <div className="flex flex-1 gap-x-4 self-stretch justify-end">
        <div className="flex items-center gap-x-4">
          {/* NOTIFICATION BELL */}
          <Popover className="relative">
            <Popover.Button className="p-2.5 text-gray-400 hover:text-brand-black hover:bg-gray-50 rounded-xl transition-all relative">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white">
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
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute right-0 z-10 mt-4 w-80 origin-top-right rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-black text-sm uppercase tracking-widest">
                    Notifications
                  </h3>
                  <Link
                    href="/account/notifications"
                    className="text-[10px] font-black text-brand-gold"
                  >
                    CLEAR ALL
                  </Link>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto px-1 custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n: any) => (
                      <div
                        key={n.id}
                        className="group p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer border border-gray-50 hover:border-brand-gold/20"
                      >
                        <div className="flex items-start gap-3">
                          {/* Status Icon based on activity type */}
                          <div className="mt-1 h-2 w-2 rounded-full bg-brand-gold shrink-0" />

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-[11px] font-black text-gray-900 leading-tight">
                                {n.activity}
                              </p>
                              <span className="text-[9px] font-bold text-gray-400 uppercase whitespace-nowrap ml-2">
                                {formatActivityDate(n.created_at)}
                              </span>
                            </div>

                            <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                              <span className="font-bold text-gray-700">
                                {n.location.split(",")[0]}
                              </span>
                              • {n.ip}
                            </p>

                            <p className="text-[9px] text-gray-400 mt-0.5 italic truncate">
                              {n.device}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                        <Bell className="h-5 w-5 text-gray-300" />
                      </div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Clean Slate
                      </p>
                    </div>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <div className="h-6 w-px bg-gray-100 hidden sm:block" />

          {/* USER DROPDOWN */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center p-1 group">
              {user?.profile_photo_path ? (
                <Image
                  src={user.profile_photo_path}
                  alt={user.name}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11 rounded-full border-2 border-white shadow-md group-hover:shadow-brand-gold/20 object-cover"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-linear-to-br from-brand-black to-gray-800 flex items-center justify-center text-brand-gold font-black border-2 border-white shadow-md group-hover:shadow-brand-gold/20 transition-all">
                  {getInitials(user?.name || "User")}
                </div>
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-4 w-64 origin-top-right rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none">
                {/* User Info Header */}
                <div className="px-4 py-3 mb-2 border-b border-gray-50">
                  <p className="text-xs font-black text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <Menu.Item>
                  <Link
                    href="/account/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors"
                  >
                    <User className="h-4 w-4 text-brand-gold" /> Profile Details
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    href="/account/virtual-accounts"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors"
                  >
                    <Settings className="h-4 w-4 text-brand-gold" /> Virtual
                    Accounts
                  </Link>
                </Menu.Item>

                <hr className="my-2 border-gray-50" />

                <Menu.Item>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
