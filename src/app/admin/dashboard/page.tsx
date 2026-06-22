"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  AlertTriangle,
  Lightbulb,
  Briefcase,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  concerns: number;
  suggestions: number;
  opportunities: number;
  events: number;
  openConcerns: number;
  openSuggestions: number;
}

interface RecentItem {
  id: string;
  type: "concern" | "suggestion";
  title?: string;
  message: string;
  created_at: string;
  status: string;
}

const MOCK_STATS: Stats = {
  concerns: 12,
  suggestions: 8,
  opportunities: 5,
  events: 3,
  openConcerns: 7,
  openSuggestions: 5,
};

const MOCK_RECENT: RecentItem[] = [
  {
    id: "1",
    type: "concern",
    message: "The library closing time is affecting students who have night classes and need resources.",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: "open",
  },
  {
    id: "2",
    type: "suggestion",
    title: "Online Course Materials",
    message: "Could we have an online portal for all course materials?",
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    status: "under_review",
  },
  {
    id: "3",
    type: "concern",
    message: "The canteen food quality has dropped significantly this semester.",
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    status: "open",
  },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>(MOCK_STATS);
  const [recent, setRecent] = useState<RecentItem[]>(MOCK_RECENT);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          { count: concernsCount },
          { count: suggestionsCount },
          { count: oppsCount },
          { count: eventsCount },
          { count: openConcernsCount },
          { count: openSuggCount },
          { data: recentData },
        ] = await Promise.all([
          supabase!.from("concerns").select("id", { count: "exact", head: true }),
          supabase!.from("suggestions").select("id", { count: "exact", head: true }),
          supabase!.from("opportunities").select("id", { count: "exact", head: true }),
          supabase!.from("events").select("id", { count: "exact", head: true }),
          supabase!.from("concerns").select("id", { count: "exact", head: true }).eq("status", "open"),
          supabase!.from("suggestions").select("id", { count: "exact", head: true }).eq("status", "open"),
          supabase!.from("concerns").select("id, message, created_at, status").order("created_at", { ascending: false }).limit(3),
        ]);
        setStats({
          concerns: concernsCount ?? 0,
          suggestions: suggestionsCount ?? 0,
          opportunities: oppsCount ?? 0,
          events: eventsCount ?? 0,
          openConcerns: openConcernsCount ?? 0,
          openSuggestions: openSuggCount ?? 0,
        });
        if (recentData) {
          setRecent(
            recentData.map((r: { id: string; message: string; created_at: string; status: string }) => ({
              ...r,
              type: "concern" as const,
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Total Concerns",
      value: stats.concerns,
      sub: `${stats.openConcerns} open`,
      icon: AlertTriangle,
      color: "bg-error-container text-error",
      href: "/admin/concerns",
    },
    {
      label: "Total Suggestions",
      value: stats.suggestions,
      sub: `${stats.openSuggestions} open`,
      icon: Lightbulb,
      color: "bg-secondary-container text-on-secondary-container",
      href: "/admin/suggestions",
    },
    {
      label: "Opportunities",
      value: stats.opportunities,
      sub: "Active listings",
      icon: Briefcase,
      color: "bg-primary/10 text-primary",
      href: "/admin/opportunities",
    },
    {
      label: "Upcoming Events",
      value: stats.events,
      sub: "This month",
      icon: Calendar,
      color: "bg-tertiary-container/30 text-on-tertiary-container",
      href: "/admin/events",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Welcome back, Administrator. {"Here's what's happening."}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="glass-card p-5 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-display text-3xl font-bold text-primary group-hover:text-secondary transition-colors">
                {loading ? "—" : card.value}
              </div>
              <div className="font-label-md text-xs font-bold text-on-surface mt-1">{card.label}</div>
              <div className="font-label-sm text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {card.sub}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Recent Submissions */}
        <div className="md:col-span-3 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-primary">Recent Submissions</h2>
            <Link href="/admin/concerns" className="text-xs text-secondary font-bold hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recent.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-surface-container-low rounded-xl">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.type === "concern" ? "bg-error-container" : "bg-secondary-container"
                  }`}
                >
                  {item.type === "concern" ? (
                    <AlertTriangle className="w-4 h-4 text-error" />
                  ) : (
                    <Lightbulb className="w-4 h-4 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {item.title && (
                    <p className="font-bold text-xs text-on-surface mb-0.5 truncate">{item.title}</p>
                  )}
                  <p className="text-xs text-on-surface-variant line-clamp-2">{item.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "open"
                          ? "bg-error-container text-error"
                          : "bg-secondary-container text-on-secondary-container"
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      {item.status.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">{timeAgo(item.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-primary mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Review Open Concerns", href: "/admin/concerns", icon: AlertTriangle, color: "text-error" },
              { label: "Review Suggestions", href: "/admin/suggestions", icon: Lightbulb, color: "text-secondary" },
              { label: "Post Opportunity", href: "/admin/opportunities/new", icon: Briefcase, color: "text-primary" },
              { label: "Create Event", href: "/admin/events/new", icon: Calendar, color: "text-primary" },
              { label: "Post Announcement", href: "/admin/announcements/new", icon: MessageSquare, color: "text-on-tertiary-container" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
                >
                  <Icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm text-on-surface font-label-md group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Status Summary */}
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary">System Status</span>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Portal is live and accepting submissions.{" "}
              {!isSupabaseConfigured && (
                <span className="text-secondary font-bold">Demo mode active.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
