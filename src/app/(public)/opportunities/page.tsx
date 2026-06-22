"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, Opportunity, EventItem } from "@/lib/supabase";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Ticket,
  Search,
  BookOpen
} from "lucide-react";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpps, setFilteredOpps] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Countdown State
  const [countdown, setCountdown] = useState({
    days: 4,
    hours: 12,
    minutes: 45,
    seconds: 9,
  });

  // Load Data
  useEffect(() => {
    async function loadData() {
      try {
        const [oppsList, eventsList] = await Promise.all([
          db.getOpportunities(),
          db.getEvents()
        ]);
        setOpportunities(oppsList);
        setEvents(eventsList);
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = opportunities;

    if (categoryFilter !== "All") {
      result = result.filter(o => o.category === categoryFilter);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        o => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)
      );
    }

    setFilteredOpps(result);
  }, [opportunities, categoryFilter, searchQuery]);

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let s = prev.seconds - 1;
        let m = prev.minutes;
        let h = prev.hours;
        let d = prev.days;

        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          d -= 1;
        }
        if (d < 0) {
          d = 0;
          h = 0;
          m = 0;
          s = 0;
          clearInterval(interval);
        }

        return { days: d, hours: h, minutes: m, seconds: s };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
      {/* Header */}
      <header className="mb-12 slide-up">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
          Growth & Connection
        </h1>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl">
          Shape your future with curated professional opportunities and stay connected with our upcoming academic and social events.
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Opportunities Section */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
            <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              Latest Opportunities
            </h2>
            
            {/* Search & Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border border-outline-variant rounded-lg text-xs font-label-md focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-outline-variant rounded-lg text-xs font-label-md px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Internship">Internships</option>
                <option value="National Service">National Service</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="glass-card p-8 rounded-xl text-center text-on-surface-variant md:col-span-2 animate-pulse">
                Loading opportunities...
              </div>
            ) : filteredOpps.length === 0 ? (
              <div className="glass-card p-8 rounded-xl text-center text-on-surface-variant md:col-span-2">
                No matching opportunities found.
              </div>
            ) : (
              filteredOpps.map((opp, idx) => {
                const isInternship = opp.category === "Internship";
                return (
                  <div
                    key={opp.id}
                    className="glass-card p-6 rounded-xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span 
                          className={`font-label-sm text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            isInternship 
                              ? "bg-secondary-container/20 text-secondary" 
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {opp.category}
                        </span>
                        <span className="text-on-surface-variant text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(opp.created_at).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      
                      <h3 className="font-display text-xl font-bold text-primary mb-3">
                        {opp.title}
                      </h3>
                      <p className="text-on-surface-variant text-body-md text-sm mb-6 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 mt-auto">
                      <span className="text-error font-label-sm text-xs font-bold uppercase tracking-wide">
                        Deadline: {new Date(opp.deadline).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                      </span>
                      <a
                        href={opp.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all duration-150"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}

            {/* Asymmetric Wide Featured Card */}
            <div className="md:col-span-2 glass-card p-6 rounded-xl flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow duration-300">
              <div className="md:w-1/3 bg-secondary-container/10 rounded-lg p-6 flex flex-col justify-center items-center text-center">
                <Sparkles className="w-12 h-12 text-secondary mb-2 fill-secondary/20" />
                <h4 className="font-display text-lg font-bold text-secondary">
                  Featured Program
                </h4>
              </div>
              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <span className="bg-secondary-container/20 text-secondary font-label-sm text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Governance Fellowship
                  </span>
                  <h3 className="font-display text-xl font-bold text-primary mt-3 mb-2">
                    Governance Excellence Fellowship
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                    A fully funded year-long fellowship for top-performing PASAL students to shadow municipal executives across the country.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                  <span className="text-on-surface-variant text-xs italic">
                    Limited to 5 candidates
                  </span>
                  <Link
                    href="/support"
                    className="bg-primary text-white px-5 py-2 rounded-lg font-semibold text-xs hover:bg-primary-container transition-all active:scale-95 duration-150"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Events Column */}
        <aside className="lg:col-span-4 space-y-6">
          <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2 pb-2 border-b border-outline-variant/30">
            <Calendar className="w-6 h-6 text-primary" />
            Up Next
          </h2>

          {/* Major Event Countdown */}
          <div className="bg-primary text-on-primary rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container opacity-10 rounded-full -mr-16 -mt-16"></div>
            <p className="font-label-sm text-secondary-container text-xs font-bold uppercase tracking-widest mb-2">
              Next Major Event
            </p>
            <h3 className="font-display text-xl font-bold mb-6 text-white">
              PASAL Annual General Meeting
            </h3>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-2 text-center mb-6">
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-2xl font-bold text-white">
                  {countdown.days.toString().padStart(2, "0")}
                </div>
                <div className="text-[9px] uppercase opacity-75 tracking-wider">Days</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-2xl font-bold text-white">
                  {countdown.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-[9px] uppercase opacity-75 tracking-wider">Hours</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-2xl font-bold text-white">
                  {countdown.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-[9px] uppercase opacity-75 tracking-wider">Mins</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-2xl font-bold text-secondary-container">
                  {countdown.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-[9px] uppercase opacity-75 tracking-wider">Secs</div>
              </div>
            </div>

            <button className="w-full bg-secondary-container text-on-secondary-container py-3 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all duration-150 flex justify-center items-center gap-2 text-sm shadow-md">
              <Ticket className="w-4 h-4" />
              RSVP Now
            </button>
          </div>

          {/* Event Cards List */}
          <div className="space-y-4">
            {loading ? (
              <div className="glass-card p-6 rounded-xl animate-pulse text-center">
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <div className="glass-card p-6 rounded-xl text-center text-on-surface-variant">
                No upcoming events listed.
              </div>
            ) : (
              events.slice(0, 3).map((evt) => (
                <div key={evt.id} className="glass-card rounded-xl overflow-hidden group hover:shadow-md transition-shadow duration-300">
                  {evt.banner_url && (
                    <div className="h-32 w-full overflow-hidden relative">
                      <img
                        src={evt.banner_url}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-display font-bold text-primary text-sm line-clamp-1">
                        {evt.title}
                      </h4>
                      <span className="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Free
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-4 text-xs text-on-surface-variant/90">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{new Date(evt.event_date).toLocaleString("en-GB", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} GMT</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{evt.venue}</span>
                      </div>
                    </div>

                    <Link
                      href="/events"
                      className="w-full py-2 border border-primary/25 text-primary text-center rounded-lg font-semibold text-xs block hover:bg-primary hover:text-white transition-all active:scale-95 duration-150"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
