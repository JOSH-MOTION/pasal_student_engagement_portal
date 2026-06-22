"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  AlertTriangle,
  Lightbulb,
  Briefcase,
  Calendar,
  Megaphone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Concerns", href: "/admin/concerns", icon: AlertTriangle },
  { label: "Suggestions", href: "/admin/suggestions", icon: Lightbulb },
  { label: "Opportunities", href: "/admin/opportunities", icon: Briefcase },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Auth guard
  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthChecked(true);
      return;
    }
    const authed =
      typeof window !== "undefined" &&
      localStorage.getItem("pasal_admin_authed") === "true";
    if (!authed) {
      router.replace("/admin/login");
    } else {
      setAuthChecked(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pasal_admin_authed");
    }
    router.push("/admin/login");
  };

  // Don't render protected layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show nothing while auth is being verified (prevents flash)
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-sm font-label-md animate-pulse">
          Verifying access…
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`px-4 py-5 border-b border-outline-variant flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/pasal_logo.png"
                alt="PASAL Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="h-6 w-px bg-primary/20 shrink-0" />
            <div className="relative w-7 h-7 shrink-0">
              <Image
                src="/UG_logo.png"
                alt="UG Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="ml-1 leading-tight">
              <h1 className="font-display text-sm font-extrabold text-primary">
                PASAL Admin
              </h1>
              <p className="text-[10px] text-on-surface-variant font-medium">
                Portal
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="relative w-7 h-7">
            <Image
              src="/pasal_logo.png"
              alt="PASAL Logo"
              fill
              className="object-contain"
            />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors hidden md:flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  active
                    ? "text-on-secondary-container"
                    : "text-on-surface-variant group-hover:text-on-surface"
                }`}
              />
              {!collapsed && (
                <span className="text-sm font-label-md truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-outline-variant space-y-1">
        {/* Back to site */}
        {!collapsed && (
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors text-xs font-label-md"
          >
            ← Public Portal
          </Link>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error-container/20 transition-all w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <span className="text-sm font-label-md">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-surface-container-low border-r border-outline-variant z-50 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-surface-container-low h-full shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-xl border-b border-outline-variant">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative w-6 h-6 shrink-0">
            <Image
              src="/pasal_logo.png"
              alt="PASAL Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display font-bold text-primary text-sm flex-1">
            PASAL Admin
          </span>
          <button
            onClick={handleLogout}
            className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
