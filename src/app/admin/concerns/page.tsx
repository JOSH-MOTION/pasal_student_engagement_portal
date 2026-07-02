"use client";

import { useEffect, useState } from "react";
import { db, Concern } from "@/lib/supabase";
import {
  AlertTriangle,
  Search,
  Filter,
  Clock,
  CheckCircle,
  RefreshCw,
  ChevronDown,
  Eye,
  X,
  MapPin,
  User as UserIcon,
  HelpCircle,
} from "lucide-react";

type Status = Concern["status"];

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  Pending: { label: "Going on", color: "bg-amber-100 text-amber-800 border border-amber-200", icon: Clock },
  Reviewed: { label: "In Progress", color: "bg-blue-100 text-blue-800 border border-blue-200", icon: RefreshCw },
  Resolved: { label: "Solved / Finished", color: "bg-green-100 text-green-800 border border-green-200", icon: CheckCircle },
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
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Concern | null>(null);
  const [newStatus, setNewStatus] = useState<Status>("Pending");
  const [saving, setSaving] = useState(false);

  const fetchConcerns = async () => {
    setLoading(true);
    try {
      const list = await db.getConcerns();
      setConcerns(list);
    } catch (err) {
      console.error("Failed to load concerns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcerns();
  }, []);

  const filtered = concerns.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      (c.username ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openConcern = (c: Concern) => {
    setSelected(c);
    setNewStatus(c.status);
  };

  const closeModal = () => setSelected(null);

  const saveUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const success = await db.updateConcernStatus(selected.id, newStatus);
      if (success) {
        setConcerns((prev) =>
          prev.map((c) => (c.id === selected.id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setSelected(null);
    }
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
        <div className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {concerns.filter((c) => c.status === "Pending").length} Going on
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
            <option value="Pending">Going on (Pending)</option>
            <option value="Reviewed">In Progress (Reviewed)</option>
            <option value="Resolved">Solved / Finished (Resolved)</option>
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
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Campus / Level</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Title & Description</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Time</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant text-sm animate-pulse">
                    Loading concerns from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant text-sm">
                    No concerns found
                  </td>
                </tr>
              ) : (
                filtered.map((concern) => {
                  const cfg = STATUS_CONFIG[concern.status] || STATUS_CONFIG.Pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={concern.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] bg-secondary-container/30 text-on-secondary-container px-2 py-0.5 rounded-full font-bold w-fit">
                            {concern.campus} Campus
                          </span>
                          {concern.level && (
                            <span className="text-[10px] bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full font-bold w-fit">
                              Level {concern.level}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-sm">
                        <p className="font-bold text-sm text-primary truncate">{concern.title}</p>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">{concern.description}</p>
                        <span className="text-[10px] text-on-surface-variant/75 mt-1 block">
                          {concern.anonymous ? "Anonymous Student" : `By: ${concern.username || "Student"}`}
                        </span>
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
              <h2 className="font-display font-bold text-lg text-primary">Concern Details ({selected.id})</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface-container-low rounded-xl space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="bg-secondary-container/30 text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {selected.campus} Campus
                  </span>
                  {selected.level && (
                    <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Level {selected.level}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-primary text-base">{selected.title}</h3>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                <div className="flex items-center gap-2 pt-2 text-[10px] text-on-surface-variant/75 border-t border-outline-variant/30">
                  <UserIcon className="w-3 h-3" />
                  <span>{selected.anonymous ? "Anonymous Student" : `Submitted by: ${selected.username || "Student"}`}</span>
                  <span>•</span>
                  <span>{new Date(selected.created_at).toLocaleString("en-GB")}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">UPDATE STATUS</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Status)}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Pending">Going on (Pending)</option>
                  <option value="Reviewed">In Progress (Reviewed)</option>
                  <option value="Resolved">Solved / Finished (Resolved)</option>
                </select>
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
