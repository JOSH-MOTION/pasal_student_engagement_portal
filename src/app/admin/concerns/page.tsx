"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  AlertTriangle,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  Eye,
  X,
} from "lucide-react";

type Status = "open" | "under_review" | "resolved" | "dismissed";

interface Concern {
  id: string;
  student_id: string | null;
  message: string;
  category: string | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
  anonymous: boolean;
}

const MOCK_CONCERNS: Concern[] = [
  {
    id: "1",
    student_id: null,
    message: "The library closing time of 9 PM is affecting students with night classes. Many of us need access to resources and study spaces beyond this hour, especially during exam periods.",
    category: "academic",
    status: "open",
    admin_notes: null,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    anonymous: true,
  },
  {
    id: "2",
    student_id: "STU-2024-001",
    message: "Canteen food quality has significantly declined this semester. The prices have gone up but the quality of food has dropped. This is a concern for students who depend on the canteen.",
    category: "welfare",
    status: "under_review",
    admin_notes: "Forwarded to Student Affairs for review.",
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    anonymous: false,
  },
  {
    id: "3",
    student_id: null,
    message: "Lecture halls in the Department of Political Science are not properly ventilated. The heat is unbearable and affects concentration during lectures.",
    category: "facilities",
    status: "resolved",
    admin_notes: "Maintenance team has addressed the ventilation issue. New fans installed.",
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    anonymous: true,
  },
  {
    id: "4",
    student_id: "STU-2024-042",
    message: "There is inadequate parking space on campus and the current situation is chaotic in the mornings.",
    category: "facilities",
    status: "open",
    admin_notes: null,
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    anonymous: false,
  },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: "Open", color: "bg-error-container text-error", icon: Clock },
  under_review: { label: "Under Review", color: "bg-secondary-container text-on-secondary-container", icon: RefreshCw },
  resolved: { label: "Resolved", color: "bg-surface-container-high text-on-surface-variant", icon: CheckCircle },
  dismissed: { label: "Dismissed", color: "bg-surface-container text-on-surface-variant", icon: XCircle },
};

const CATEGORY_LABELS: Record<string, string> = {
  academic: "Academic",
  welfare: "Student Welfare",
  facilities: "Facilities",
  financial: "Financial",
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

export default function AdminConcernsPage() {
  const [concerns, setConcerns] = useState<Concern[]>(MOCK_CONCERNS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Concern | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<Status>("open");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const fetchConcerns = async () => {
      setLoading(true);
      const { data } = await supabase!
        .from("concerns")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setConcerns(data);
      setLoading(false);
    };
    fetchConcerns();
  }, []);

  const filtered = concerns.filter((c) => {
    const matchSearch =
      c.message.toLowerCase().includes(search.toLowerCase()) ||
      (c.category ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openConcern = (c: Concern) => {
    setSelected(c);
    setAdminNotes(c.admin_notes ?? "");
    setNewStatus(c.status);
  };

  const closeModal = () => setSelected(null);

  const saveUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    const updated = { ...selected, status: newStatus, admin_notes: adminNotes };

    if (isSupabaseConfigured && supabase) {
      await supabase!.from("concerns").update({
        status: newStatus,
        admin_notes: adminNotes,
      }).eq("id", selected.id);
    }

    setConcerns((prev) =>
      prev.map((c) => (c.id === selected.id ? updated : c))
    );
    setSaving(false);
    setSelected(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Concerns</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage and respond to student concerns
          </p>
        </div>
        <div className="bg-error-container text-error px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {concerns.filter((c) => c.status === "open").length} Open
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search concerns…"
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
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low/50">
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Message</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Time</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant text-sm">
                    No concerns found
                  </td>
                </tr>
              ) : (
                filtered.map((concern) => {
                  const cfg = STATUS_CONFIG[concern.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={concern.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-xs bg-secondary-container/30 text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                          {CATEGORY_LABELS[concern.category ?? "other"] ?? "Other"}
                        </span>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-sm text-on-surface line-clamp-2">{concern.message}</p>
                        {concern.anonymous && (
                          <span className="text-[10px] text-on-surface-variant mt-0.5 block">Anonymous</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                        {timeAgo(concern.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => openConcern(concern)}
                          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 slide-up">
            <button onClick={closeModal} className="absolute right-4 top-4 text-on-surface-variant hover:text-primary">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-error" />
              <h2 className="font-display font-bold text-lg text-primary">Concern Details</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface-container-low rounded-xl">
                <p className="text-sm text-on-surface">{selected.message}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-on-surface-variant">
                  <span className="bg-secondary-container/30 text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                    {CATEGORY_LABELS[selected.category ?? "other"] ?? "Other"}
                  </span>
                  <span>{selected.anonymous ? "Anonymous" : `ID: ${selected.student_id}`}</span>
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
                  placeholder="Add notes or response…"
                  rows={4}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-outline text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveUpdate}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
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
