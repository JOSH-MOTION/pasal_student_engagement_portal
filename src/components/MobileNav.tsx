"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Briefcase, User } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Concerns", href: "/concerns", icon: MessageSquare },
    { label: "Opportunities", href: "/opportunities", icon: Briefcase },
    { label: "Me", href: "/admin/login", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-primary/10 flex justify-around items-center h-16 px-4 z-50 shadow-lg">
      {navItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all duration-150 active:scale-95 ${
              active ? "text-primary font-bold" : "text-on-surface-variant"
            }`}
          >
            <Icon className={`w-5.5 h-5.5 ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
