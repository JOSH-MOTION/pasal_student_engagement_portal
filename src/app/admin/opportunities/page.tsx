"use client";

import { useEffect, useState } from "react";
import { db, Opportunity } from "@/lib/supabase";
import {
  Briefcase,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Search,
  Calendar,
} from "lucide-react";

const EMPTY_FORM = {
  title: "",
  category: "Internship" as "Internship" | "National Service",
  description: "",
  application_link: "",
  deadline: "",
};

export default function AdminOpportunitiesPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const data = await db.getOpportunities();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.application_link || !formData.deadline) {
      alert("Please fill in all fields.");
      return;
    }
    setSaving(true);
    try {
      const added = await db.addOpportunity({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        application_link: formData.application_link,
        deadline: new Date(formData.deadline).toISOString(),
      });
      setItems((prev) => [added, ...prev]);
      setShowForm(false);
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      alert("Failed to save opportunity.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      const success = await db.deleteOpportunity(id);
      if (success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete opportunity.");
    }
  };

  const filtered = items.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Opportunities</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage careers, internships, and national service positions</p>
        </div>
        <button
          onClick={() => {
            setFormData(EMPTY_FORM);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/95 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Opportunity
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search opportunities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm animate-pulse">
            Loading opportunities...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-2 glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm">
            No opportunities found
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    item.category === "Internship" ? "bg-primary/10 text-primary" : "bg-secondary-container text-on-secondary-container"
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-on-surface-variant whitespace-nowrap">ID: {item.id}</span>
                </div>
                <h3 className="font-display font-bold text-primary text-base mb-1">{item.title}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-3 mb-4 leading-relaxed">{item.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3 mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  <span>Deadline: {new Date(item.deadline).toLocaleDateString("en-GB")}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={item.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors text-primary"
                    title="View Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-error-container/50 hover:bg-error-container text-error transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-primary">New Opportunity</h2>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Policy Intern"
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as "Internship" | "National Service" })}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Internship">Internship</option>
                  <option value="National Service">National Service</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Application URL</label>
                <input
                  type="url"
                  required
                  value={formData.application_link}
                  onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
                  placeholder="https://example.com/apply"
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Deadline Date</label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe requirements and responsibilities..."
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
                  {saving ? "Saving..." : "Create Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
