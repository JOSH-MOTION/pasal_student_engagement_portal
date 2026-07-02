"use client";

import { useEffect, useState } from "react";
import { db, Suggestion, supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Lightbulb,
  Search,
  ChevronDown,
  Eye,
  X,
  ThumbsUp,
  Trash2,
} from "lucide-react";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const list = await db.getSuggestions();
      setSuggestions(list);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const filtered = suggestions.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      (s.username ?? "").toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this suggestion?")) return;
    setDeleting(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("suggestions").delete().eq("id", id);
        if (error) throw error;
      }
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      console.error("Failed to delete suggestion:", err);
      alert("Error deleting suggestion. Make sure you are logged in.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Suggestions</h1>
          <p className="text-on-surface-variant text-sm mt-1">Review and manage student suggestions</p>
        </div>
        <div className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" />
          {suggestions.length} Total
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
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm animate-pulse">
            Loading suggestions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm">No suggestions found</div>
        ) : (
          filtered.map((s) => {
            return (
              <div key={s.id} className="glass-card rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-display font-bold text-primary text-sm">{s.title}</h3>
                      <span className="text-[10px] bg-secondary-container/30 text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                        {s.campus} Campus
                      </span>
                      {s.level && (
                        <span className="text-[10px] bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full font-bold">
                          Level {s.level}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant line-clamp-2">{s.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-secondary" />
                        {s.likes} upvotes
                      </span>
                      <span>{s.anonymous ? "Anonymous Student" : `By: ${s.username || "Student"}`}</span>
                      <span>{timeAgo(s.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelected(s)}
                      className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={deleting}
                      className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-error hover:bg-error-container/30 transition-colors bg-error-container/10 px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
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
                <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">{selected.description}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
                  <span className="flex items-center gap-1 font-bold text-secondary">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {selected.likes} upvotes
                  </span>
                  <span>{selected.anonymous ? "Anonymous Student" : `By: ${selected.username || "Student"}`}</span>
                  <span>{new Date(selected.created_at).toLocaleString("en-GB")}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 rounded-xl border border-outline text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-error text-white text-sm font-bold hover:bg-error/90 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Suggestion"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
