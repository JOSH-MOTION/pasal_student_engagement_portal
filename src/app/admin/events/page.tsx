"use client";

import { useEffect, useState } from "react";
import { db, EventItem } from "@/lib/supabase";
import {
  Calendar,
  Plus,
  Trash2,
  X,
  MapPin,
  Clock,
  Search,
} from "lucide-react";

const EMPTY_FORM = {
  title: "",
  description: "",
  venue: "",
  event_date: "",
  banner_url: "",
};

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await db.getEvents();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.venue || !formData.event_date) {
      alert("Please fill in all fields.");
      return;
    }
    setSaving(true);
    try {
      const added = await db.addEvent({
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        event_date: new Date(formData.event_date).toISOString(),
        banner_url: formData.banner_url || undefined,
      });
      setItems((prev) => [added, ...prev]);
      setShowForm(false);
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      alert("Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const success = await db.deleteEvent(id);
      if (success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const filtered = items.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.venue.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Events</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage departmental events, lectures, and activities</p>
        </div>
        <button
          onClick={() => {
            setFormData(EMPTY_FORM);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/95 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm animate-pulse">
            Loading events...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-2 glass-card rounded-2xl p-12 text-center text-on-surface-variant text-sm">
            No events found
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                {item.banner_url && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3 bg-surface-container-low">
                    <img src={item.banner_url} alt={item.title} className="object-cover w-full h-full" />
                  </div>
                )}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Event
                  </span>
                  <span className="text-[10px] text-on-surface-variant whitespace-nowrap">ID: {item.id}</span>
                </div>
                <h3 className="font-display font-bold text-primary text-base mb-1">{item.title}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-3 mb-4 leading-relaxed">{item.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3 mt-auto flex-wrap gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    <span>Venue: {item.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Date: {new Date(item.event_date).toLocaleString("en-GB")}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-error-container/50 hover:bg-error-container text-error transition-colors ml-auto"
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
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-primary">New Event</h2>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Careers Panel"
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Venue / Location</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Great Hall"
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Event Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 tracking-wider uppercase">Banner Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
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
                  placeholder="Describe the event itinerary, speakers, etc..."
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
                  {saving ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
