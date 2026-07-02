"use client";

import { useEffect, useState } from "react";
import { db, Announcement, supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Megaphone,
  Plus,
  Trash2,
  X,
  Search,
} from "lucide-react";

const EMPTY_FORM = {
  title: "",
  content: "",
};

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await db.getAnnouncements();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Please fill in all fields.");
      return;
    }
    setSaving(true);
    try {
      const added = await db.addAnnouncement({
        title: formData.title,
        content: formData.content,
      });
      setItems((prev) => [added, ...prev]);
      setShowForm(false);
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      alert("Failed to save announcement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("announcements").delete().eq("id", id);
        if (error) throw error;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete announcement.");
    }
  };

  const filtered = items.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Announcements</h1>
          <p className="text-on-surface-variant text-sm mt-1">Publish news and noticeboard updates for students</p>
        </div>
        <button
          onClick={() => {
            setFormData(EMPTY_FORM);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/95 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Post Announcement
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search announcements…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm animate-pulse">
            Loading announcements...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm">
            No announcements found
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Announcement
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {new Date(item.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-primary text-sm mb-1">{item.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{item.content}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-error-container/50 hover:bg-error-container text-error transition-colors shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 slide-up max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute right-4 top-4 text-on-surface-variant hover:text-primary">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-primary">New Announcement</h2>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mid-Sem Timetable Released"
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Content</label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the full announcement content..."
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-outline text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Posting..." : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
