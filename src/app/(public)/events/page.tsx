"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, EventItem } from "@/lib/supabase";
import { Calendar, MapPin, Ticket, Clock, HelpCircle, ArrowRight } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Countdown State for next event
  const [countdown, setCountdown] = useState({
    days: 4,
    hours: 12,
    minutes: 45,
    seconds: 9,
  });

  useEffect(() => {
    async function loadEvents() {
      try {
        const list = await db.getEvents();
        setEvents(list);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

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
          Academic & Social Events
        </h1>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl">
          Stay connected, informed, and inspired. Join the PASAL community at our general assemblies, career seminars, and networking mixers.
        </p>
      </header>

      {/* Hero Next Event CountDown Banner */}
      <section className="mb-12 slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="bg-primary text-on-primary rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container opacity-5 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
          
          <div className="lg:col-span-7 space-y-6">
            <span className="bg-secondary-container text-on-secondary-container font-label-md text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              UP NEXT: ANNUAL GENERAL MEETING
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
              PASAL Annual General Meeting 2026
            </h2>
            <p className="text-surface-container-low opacity-90 leading-relaxed text-sm md:text-base">
              The official general meeting of the Public Administration Students Association. All members are requested to join us as we discuss important policy amendments, annual budget projections, and administrative reforms.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-surface-container-lowest">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary-container" />
                <span>Central Auditorium, University of Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary-container" />
                <span>Starts in 4 days at 14:00 GMT</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/10 rounded-xl p-6 border border-white/10 backdrop-blur-sm flex flex-col justify-center items-center text-center">
            <p className="font-label-sm text-[10px] font-bold uppercase tracking-widest text-secondary-container mb-4">
              Time Remaining Until Event
            </p>
            <div className="grid grid-cols-4 gap-3 text-center mb-6 w-full">
              <div className="bg-primary-container p-3 rounded-lg border border-white/5">
                <div className="text-3xl font-extrabold text-white">
                  {countdown.days.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase opacity-75 mt-1">Days</div>
              </div>
              <div className="bg-primary-container p-3 rounded-lg border border-white/5">
                <div className="text-3xl font-extrabold text-white">
                  {countdown.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase opacity-75 mt-1">Hours</div>
              </div>
              <div className="bg-primary-container p-3 rounded-lg border border-white/5">
                <div className="text-3xl font-extrabold text-white">
                  {countdown.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase opacity-75 mt-1">Mins</div>
              </div>
              <div className="bg-primary-container p-3 rounded-lg border border-white/5">
                <div className="text-3xl font-extrabold text-secondary-container">
                  {countdown.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase opacity-75 mt-1">Secs</div>
              </div>
            </div>
            <button className="w-full bg-secondary-container text-on-secondary-container py-3 rounded-lg font-bold hover:brightness-115 active:scale-95 transition-all duration-150 flex justify-center items-center gap-2 text-sm shadow-md">
              <Ticket className="w-4 h-4" />
              Claim RSVP Ticket
            </button>
          </div>
        </div>
      </section>

      {/* All Upcoming Events Section */}
      <section className="space-y-8">
        <h3 className="font-display text-2xl font-bold text-primary">
          Upcoming Events Directory
        </h3>

        {loading ? (
          <div className="glass-card p-12 rounded-xl text-center text-on-surface-variant animate-pulse">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="glass-card p-12 rounded-xl text-center text-on-surface-variant flex flex-col items-center gap-2">
            <HelpCircle className="w-10 h-10 text-on-surface-variant/50" />
            No additional events listed right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt, idx) => (
              <div
                key={evt.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {evt.banner_url && (
                  <div className="h-44 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent z-10"></div>
                    <img
                      src={evt.banner_url}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="bg-primary/5 text-primary text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        PASAL Event
                      </span>
                      <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded">
                        GHS 20.00
                      </span>
                    </div>

                    <h4 className="font-display text-xl font-bold text-primary leading-tight">
                      {evt.title}
                    </h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-outline-variant/30 space-y-3">
                    <div className="flex items-center gap-2.5 text-xs text-on-surface-variant">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span>{new Date(evt.event_date).toLocaleString("en-GB", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} GMT</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-on-surface-variant">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span>{evt.venue}</span>
                    </div>
                    
                    <button className="w-full mt-4 py-2.5 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-150 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 active:scale-95">
                      Register Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
