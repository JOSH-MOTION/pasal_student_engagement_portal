"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  X,
  Pin,
  Search,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "urgent";
  is_pinned: boolean;
  is_active: boolean;
  created_at: string;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "PASAL Elections Coming Up",
    content: "Nominations for the 2024/2025 PASAL Executive Committee are now open. All interested candidates should submit their forms at the PASAL secretariat by July 15, 2024.",
    type: "info",
    is_pinned: true,
    is_active: true,
    created_at: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
  },
  {
    id: "2",
    title: "Deadline Extension: Concerns Portal",
    content: "The deadline for submitting semester-end concerns has been extended to July 31, 2024. Students are encouraged to use the portal to raise any academic or welfare issues.",
    type: "success",
    is_pinned: false,
    is_active: true,
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
  {
    id: "3",
    title: "Campus Network Maintenance",
    content: "The university ICT center will be performing scheduled maintenance on July 18, 2024. Expect intermittent internet disruptions between 10 AM and 2 PM.",
    type: "warning",
    is_pinned: false,
    is_active: true,
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  },
];

const TYPE_CONFIG = {
  info: { label: "Info", color: "bg-primary/10 text-primary border-primary/20" },
  warning: { label: "Warning", color: "bg-secondary-container text-on-secondary-container border-secondary/20" },
  success: { label: "Success", color: "bg-primary/5 text-primary border-primary/10" },
  urgent: { label: "Urgent", color: "bg-error-container text-error border-error/20" },
};

const EMPTY_FORM = {
  title: "",
  content: "",
  type: "info" as Announcement["type"],
  is_pinned: false,
  is_active: true,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = [...items]
    .filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));

  const openNew = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item: Announcement) => {
    setEditItem(item);
    setForm({
      title: item.title,
      content: item.content,
      type: item.type,
      is_pinned: item.is_pinned,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        if (isSupabaseConfigured && supabase) {
          await supabase!.from("announcements").update(form).eq("id", editItem.id);
        }
        setItems((prev) => prev.map((a) => (a.id === editItem.id ? { ...editItem, ...form } : a)));
      } else {
        const newItem: Announcement = {
          ...form,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase!.from("announcements").insert(form).select().single();
          if (data) newItem.id = data.id;
        }
        setItems((prev) => [newItem, ...prev]);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase!.from("announcements").delete().eq("id", id);
    }
    setItems((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const togglePin = async (item: Announcement) => {
    const updated = { ...item, is_pinned: !item.is_pinned };
    if (isSupabaseConfigured && supabase) {
      await supabase!.from("announcements").update({ is_pinned: !item.is_pinned }).eq("id", item.id);
    }
    setItems((prev) => prev.map((a) => (a.id === item.id ? updated : a)));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Announcements</h1>
          <p className="text-on-surface-variant text-sm mt-1">Post and manage announcements for students</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search announcements…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm">No announcements yet.</div>
        ) : (
          filtered.map((item) => {
            const cfg = TYPE_CONFIG[item.type];
            return (
              <div
                key={item.id}
                className={`glass-card rounded-2xl p-5 border-l-4 ${
                  item.type === "urgent"
                    ? "border-error"
                    : item.type === "warning"
                    ? "border-secondary"
                    : "border-primary"
                } ${!item.is_active ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {item.is_pinned && (
                        <span className="flex items-center gap-0.5 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                          <Pin className="w-2.5 h-2.5" />
                          Pinned
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {!item.is_active && (
                        <span className="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-bold">Draft</span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-primary text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{item.content}</p>
                    <p className="text-[10px] text-on-surface-variant mt-2">{timeAgo(item.created_at)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => togglePin(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.is_pinned
                          ? "text-primary bg-primary/10"
                          : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                      }`}
                      title={item.is_pinned ? "Unpin" : "Pin"}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 slide-up max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute right-4 top-4 text-on-surface-variant hover:text-primary">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <Megaphone className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-primary">
                {editItem ? "Edit Announcement" : "New Announcement"}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">TITLE</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Announcement title…"
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">TYPE</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Announcement["type"] }))}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">CONTENT</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Announcement content…"
                  rows={5}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_pinned}
                    onChange={(e) => setForm((f) => ({ ...f, is_pinned: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-on-surface font-label-md">Pin to top</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-on-surface font-label-md">Publish (visible to students)</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-outline text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.content}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving…" : editItem ? "Save Changes" : "Post Announcement"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 slide-up text-center">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-primary mb-2">Delete Announcement?</h3>
            <p className="text-sm text-on-surface-variant mb-6">This will remove it from the student portal.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-outline text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-error text-white text-sm font-bold hover:bg-error/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
