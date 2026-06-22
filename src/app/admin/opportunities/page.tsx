"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Search,
  Calendar,
} from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: string;
  description: string;
  deadline: string | null;
  location: string | null;
  link: string | null;
  is_active: boolean;
  created_at: string;
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    title: "Graduate Policy Analyst Internship",
    organization: "Ghana Revenue Authority",
    type: "internship",
    description: "Join the GRA's policy team for a 3-month internship to analyze fiscal policies and contribute to tax reform recommendations.",
    deadline: "2024-08-15",
    location: "Accra, Ghana",
    link: "https://gra.gov.gh/careers",
    is_active: true,
    created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
  {
    id: "2",
    title: "Commonwealth Essay Competition",
    organization: "Commonwealth Foundation",
    type: "scholarship",
    description: "Annual essay competition open to students aged 18-25 across Commonwealth countries. First prize includes £3,000 and publication.",
    deadline: "2024-09-01",
    location: "Remote",
    link: "https://commonwealth.int/essay",
    is_active: true,
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  },
  {
    id: "3",
    title: "UN Youth Delegate Program",
    organization: "United Nations",
    type: "fellowship",
    description: "Selected delegates will represent Ghana at the UN General Assembly Youth Forum in New York.",
    deadline: "2024-07-30",
    location: "New York, USA",
    link: null,
    is_active: false,
    created_at: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
  },
];

const TYPE_LABELS: Record<string, string> = {
  internship: "Internship",
  scholarship: "Scholarship",
  fellowship: "Fellowship",
  job: "Job",
  competition: "Competition",
  other: "Other",
};

const TYPE_COLORS: Record<string, string> = {
  internship: "bg-primary/10 text-primary",
  scholarship: "bg-secondary-container text-on-secondary-container",
  fellowship: "bg-tertiary-container/30 text-on-tertiary-container",
  job: "bg-surface-container-high text-on-surface",
  competition: "bg-error-container/30 text-error",
  other: "bg-surface-container text-on-surface-variant",
};

const EMPTY_FORM = {
  title: "",
  organization: "",
  type: "internship",
  description: "",
  deadline: "",
  location: "",
  link: "",
  is_active: true,
};

export default function AdminOpportunitiesPage() {
  const [items, setItems] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Opportunity | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = items.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.organization.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item: Opportunity) => {
    setEditItem(item);
    setForm({
      title: item.title,
      organization: item.organization,
      type: item.type,
      description: item.description,
      deadline: item.deadline ?? "",
      location: item.location ?? "",
      link: item.link ?? "",
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        const updated = { ...editItem, ...form };
        if (isSupabaseConfigured && supabase) {
          await supabase!.from("opportunities").update(form).eq("id", editItem.id);
        }
        setItems((prev) => prev.map((o) => (o.id === editItem.id ? updated : o)));
      } else {
        const newItem: Opportunity = {
          ...form,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          deadline: form.deadline || null,
          location: form.location || null,
          link: form.link || null,
        };
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase!.from("opportunities").insert(form).select().single();
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
      await supabase!.from("opportunities").delete().eq("id", id);
    }
    setItems((prev) => prev.filter((o) => o.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Opportunities</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage internships, scholarships & fellowships</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search opportunities…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`glass-card rounded-2xl p-5 border-l-4 ${
              item.is_active ? "border-primary" : "border-outline-variant opacity-60"
            } transition-all`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type] ?? TYPE_COLORS.other}`}>
                    {TYPE_LABELS[item.type] ?? item.type}
                  </span>
                  {!item.is_active && (
                    <span className="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-bold">Inactive</span>
                  )}
                </div>
                <h3 className="font-display font-bold text-primary text-sm leading-snug">{item.title}</h3>
                <p className="text-xs text-secondary font-bold mt-0.5">{item.organization}</p>
              </div>
              <div className="flex gap-1">
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
            <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">{item.description}</p>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              {item.deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="w-3 h-3" />
                  View
                </a>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm">
            No opportunities found. Add your first one!
          </div>
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
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-primary">
                {editItem ? "Edit Opportunity" : "New Opportunity"}
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Title", key: "title", type: "text", placeholder: "e.g. Graduate Analyst Internship" },
                { label: "Organization", key: "organization", type: "text", placeholder: "e.g. Ghana Revenue Authority" },
                { label: "Location", key: "location", type: "text", placeholder: "e.g. Accra, Ghana or Remote" },
                { label: "Application Link", key: "link", type: "url", placeholder: "https://..." },
                { label: "Deadline", key: "deadline", type: "date", placeholder: "" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">{field.label.toUpperCase()}</label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof EMPTY_FORM] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">TYPE</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">DESCRIPTION</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the opportunity…"
                  rows={4}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-on-surface font-label-md">Active (visible to students)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-outline text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.description} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  {saving ? "Saving…" : editItem ? "Save Changes" : "Create Opportunity"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 slide-up text-center">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-primary mb-2">Delete Opportunity?</h3>
            <p className="text-sm text-on-surface-variant mb-6">This action cannot be undone.</p>
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
