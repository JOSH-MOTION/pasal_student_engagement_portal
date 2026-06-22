"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Lightbulb,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  Eye,
  X,
  ThumbsUp,
} from "lucide-react";

type Status = "open" | "under_review" | "accepted" | "dismissed";

interface Suggestion {
  id: string;
  title: string;
  message: string;
  category: string | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
  anonymous: boolean;
  upvotes: number;
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    title: "Online Course Material Portal",
    message: "PASAL should advocate for an online portal where all course materials, past exam questions, and lecture slides are uploaded by lecturers for easy student access.",
    category: "academic",
    status: "open",
    admin_notes: null,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    anonymous: false,
    upvotes: 24,
  },
  {
    id: "2",
    title: "Student Mentorship Program",
    message: "Establish a formal mentorship program that connects final-year students with first and second-year students to guide them through academic and professional development.",
    category: "academic",
    status: "accepted",
    admin_notes: "Approved and forwarded to the Academic Affairs committee. Implementation starts next semester.",
    created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    anonymous: true,
    upvotes: 41,
  },
  {
    id: "3",
    title: "Career Fair Twice a Year",
    message: "We should host a career fair at the start and end of each academic year so students can connect with potential employers and get internship opportunities.",
    category: "career",
    status: "under_review",
    admin_notes: "Currently in discussion with the career center.",
    created_at: new Date(Date.now() - 4 * 24 * 3600000).toISOString(),
    anonymous: false,
    upvotes: 36,
  },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: "Open", color: "bg-error-container text-error", icon: Clock },
  under_review: { label: "Under Review", color: "bg-secondary-container text-on-secondary-container", icon: RefreshCw },
  accepted: { label: "Accepted", color: "bg-primary/10 text-primary", icon: CheckCircle },
  dismissed: { label: "Dismissed", color: "bg-surface-container text-on-surface-variant", icon: XCircle },
};

const CATEGORY_LABELS: Record<string, string> = {
  academic: "Academic",
  career: "Career",
  welfare: "Student Welfare",
  facilities: "Facilities",
  other: "Other",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<Status>("open");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase!.from("suggestions").select("*").order("created_at", { ascending: false });
      if (data) setSuggestions(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = suggestions.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openSuggestion = (s: Suggestion) => {
    setSelected(s);
    setAdminNotes(s.admin_notes ?? "");
    setNewStatus(s.status);
  };

  const saveUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    const updated = { ...selected, status: newStatus, admin_notes: adminNotes };
    if (isSupabaseConfigured && supabase) {
      await supabase!.from("suggestions").update({ status: newStatus, admin_notes: adminNotes }).eq("id", selected.id);
    }
    setSuggestions((prev) => prev.map((s) => (s.id === selected.id ? updated : s)));
    setSaving(false);
    setSelected(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Suggestions</h1>
          <p className="text-on-surface-variant text-sm mt-1">Review and act on student suggestions</p>
        </div>
        <div className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" />
          {suggestions.filter((s) => s.status === "open").length} Open
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search suggestions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status | "all")}
            className="pl-9 pr-8 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="dismissed">Dismissed</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm">No suggestions found</div>
        ) : (
          filtered.map((s) => {
            const cfg = STATUS_CONFIG[s.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={s.id} className="glass-card rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-display font-bold text-primary text-sm">{s.title}</h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {cfg.label}
                      </span>
                      {s.category && (
                        <span className="text-[10px] bg-secondary-container/30 text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                          {CATEGORY_LABELS[s.category] ?? s.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant line-clamp-2">{s.message}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-secondary" />
                        {s.upvotes} upvotes
                      </span>
                      <span>{s.anonymous ? "Anonymous" : "Named"}</span>
                      <span>{timeAgo(s.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openSuggestion(s)}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Review
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 slide-up">
            <button onClick={() => setSelected(null)} className="absolute right-4 top-4 text-on-surface-variant hover:text-primary">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-secondary" />
              <h2 className="font-display font-bold text-lg text-primary">{selected.title}</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-low rounded-xl">
                <p className="text-sm text-on-surface">{selected.message}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-secondary" />
                    {selected.upvotes} upvotes
                  </span>
                  <span>{timeAgo(selected.created_at)}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">UPDATE STATUS</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Status)}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">ADMIN NOTES</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add response or notes…"
                  rows={4}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-xl border border-outline text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                <button onClick={saveUpdate} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {saving ? "Saving…" : "Save Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
