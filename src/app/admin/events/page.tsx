"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  MapPin,
  Clock,
  Users,
  Search,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string | null;
  location: string | null;
  type: string;
  is_active: boolean;
  max_attendees: number | null;
  created_at: string;
}

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "PASAL General Assembly",
    description: "The bi-annual general assembly where all PASAL members gather to discuss current issues, elect officers, and deliberate on key decisions.",
    date: "2024-07-20",
    time: "10:00",
    location: "Great Hall, University of Ghana",
    type: "assembly",
    is_active: true,
    max_attendees: null,
    created_at: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
  },
  {
    id: "2",
    title: "Career & Networking Workshop",
    description: "A practical workshop on CV building, interview preparation, and professional networking for students in their final year.",
    date: "2024-07-28",
    time: "09:00",
    location: "Faculty of Social Studies, Seminar Room A",
    type: "workshop",
    is_active: true,
    max_attendees: 60,
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
  {
    id: "3",
    title: "Public Lecture: Governance in Ghana",
    description: "A distinguished lecture by Prof. Ama Duah on the state of public administration and governance in contemporary Ghana.",
    date: "2024-08-05",
    time: "14:00",
    location: "Balme Library Auditorium",
    type: "lecture",
    is_active: true,
    max_attendees: 200,
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  },
];

const TYPE_LABELS: Record<string, string> = {
  assembly: "General Assembly",
  workshop: "Workshop",
  lecture: "Public Lecture",
  social: "Social Event",
  seminar: "Seminar",
  other: "Other",
};

const TYPE_COLORS: Record<string, string> = {
  assembly: "bg-primary/10 text-primary",
  workshop: "bg-secondary-container text-on-secondary-container",
  lecture: "bg-tertiary-container/30 text-on-tertiary-container",
  social: "bg-error-container/20 text-error",
  seminar: "bg-surface-container-high text-on-surface",
  other: "bg-surface-container text-on-surface-variant",
};

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  type: "workshop",
  is_active: true,
  max_attendees: "",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AdminEventsPage() {
  const [items, setItems] = useState<Event[]>(MOCK_EVENTS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Event | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = items.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const openNew = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item: Event) => {
    setEditItem(item);
    setForm({
      title: item.title,
      description: item.description,
      date: item.date,
      time: item.time ?? "",
      location: item.location ?? "",
      type: item.type,
      is_active: item.is_active,
      max_attendees: item.max_attendees?.toString() ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        time: form.time || null,
        location: form.location || null,
        max_attendees: form.max_attendees ? parseInt(form.max_attendees) : null,
      };
      if (editItem) {
        if (isSupabaseConfigured && supabase) {
          await supabase!.from("events").update(payload).eq("id", editItem.id);
        }
        setItems((prev) => prev.map((e) => (e.id === editItem.id ? { ...editItem, ...payload } : e)));
      } else {
        const newItem: Event = {
          ...payload,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase!.from("events").insert(payload).select().single();
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
      await supabase!.from("events").delete().eq("id", id);
    }
    setItems((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Events</h1>
          <p className="text-on-surface-variant text-sm mt-1">Create and manage upcoming events</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search events…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm">
            No events found. Create your first event!
          </div>
        ) : (
          sorted.map((event) => {
            const isPast = new Date(event.date) < new Date();
            return (
              <div
                key={event.id}
                className={`glass-card rounded-2xl p-5 flex gap-4 ${isPast ? "opacity-60" : ""}`}
              >
                {/* Date Block */}
                <div className="w-16 h-16 bg-primary rounded-xl flex flex-col items-center justify-center text-white shrink-0">
                  <span className="font-display text-xl font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {new Date(event.date).toLocaleDateString("en-GB", { month: "short" })}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-display font-bold text-primary text-sm">{event.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[event.type] ?? TYPE_COLORS.other}`}>
                          {TYPE_LABELS[event.type] ?? event.type}
                        </span>
                        {!event.is_active && (
                          <span className="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-bold">Draft</span>
                        )}
                        {isPast && (
                          <span className="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-bold">Past</span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-on-surface-variant flex-wrap">
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                        {event.max_attendees && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Max {event.max_attendees}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(event)}
                        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(event.id)}
                        className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-primary">
                {editItem ? "Edit Event" : "Create Event"}
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Event Title", key: "title", type: "text", placeholder: "e.g. PASAL General Assembly" },
                { label: "Location", key: "location", type: "text", placeholder: "e.g. Great Hall, UG" },
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">DATE</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">TIME</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">MAX ATTENDEES</label>
                  <input
                    type="number"
                    value={form.max_attendees}
                    onChange={(e) => setForm((f) => ({ ...f, max_attendees: e.target.value }))}
                    placeholder="Leave blank for unlimited"
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 tracking-wider">DESCRIPTION</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the event…"
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
                <span className="text-sm text-on-surface font-label-md">Publish (visible to students)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-outline text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.date}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving…" : editItem ? "Save Changes" : "Create Event"}
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
            <h3 className="font-display font-bold text-lg text-primary mb-2">Delete Event?</h3>
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
