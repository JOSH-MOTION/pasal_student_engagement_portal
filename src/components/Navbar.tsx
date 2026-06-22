"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, User, Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Concerns", href: "/concerns" },
    { label: "Suggestions", href: "/suggestions" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Events", href: "/events" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-surface-container/80 backdrop-blur-xl border-b border-primary/10 shadow-sm h-16 transition-all duration-200">
        <div className="flex justify-between items-center max-w-[1200px] mx-auto px-container-padding-desktop h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 transition-transform active:scale-98">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9">
              <Image
                src="/pasal_logo.png"
                alt="PASAL Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="h-6 w-px bg-primary/20" />
            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
              <Image
                src="/UG_logo.png"
                alt="UG Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display text-headline-sm font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden xs:block ml-1">
              PASAL
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-display text-body-md">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all duration-200 hover:text-secondary pb-1 ${
                    active
                      ? "text-primary border-b-2 border-secondary-container font-semibold"
                      : "text-on-surface-variant"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section Buttons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-primary hover:bg-primary/5 rounded-full transition-transform active:scale-95 duration-150">
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/admin/login"
              className="flex items-center gap-2 cursor-pointer active:scale-95 hover:bg-primary/5 px-3 py-1.5 rounded-full transition-all duration-150"
            >
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <User className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="hidden sm:inline font-label-md text-label-md font-bold text-primary">
                Profile
              </span>
            </Link>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-primary/10 shadow-lg p-4 z-40 slide-up">
            <div className="flex flex-col gap-4 font-display text-body-md">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-secondary-container/10 text-primary font-bold"
                        : "text-on-surface-variant hover:bg-background"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
