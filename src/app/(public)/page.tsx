"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db, Concern, Suggestion, Opportunity, EventItem, Announcement } from "@/lib/supabase";
import { 
  AlertTriangle, 
  Lightbulb, 
  Briefcase, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Megaphone
} from "lucide-react";

export default function Homepage() {
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Campus Carousel Index
  const [activeCampusIndex, setActiveCampusIndex] = useState(0);

  const campuses = [
    {
      name: "Main Campus",
      desc: "The heart of PASAL administration and student life.",
      students: "4500 Students",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    },
    {
      name: "City Campus",
      desc: "Where urban dynamism meets academic excellence.",
      students: "1200 Students",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    },
    {
      name: "Satellite Campus",
      desc: "Focused learning hubs across the regional network.",
      students: "800 Students",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [cList, sList, oList, eList, aList] = await Promise.all([
          db.getConcerns(),
          db.getSuggestions(),
          db.getOpportunities(),
          db.getEvents(),
          db.getAnnouncements(),
        ]);
        setConcerns(cList);
        setSuggestions(sList);
        setOpportunities(oList);
        setEvents(eList);
        setAnnouncements(aList);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const slideLeft = () => {
    setActiveCampusIndex((prev) => (prev === 0 ? campuses.length - 1 : prev - 1));
  };

  const slideRight = () => {
    setActiveCampusIndex((prev) => (prev === campuses.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="animate-fadeIn">
      {/* Announcements Ticker / Alert Bar */}
      {announcements.length > 0 && (
        <div className="bg-[#fdcc14] text-[#001057] border-y border-[#fdcc14]/20 py-3 overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-[#001057] animate-bounce shrink-0" />
            <div className="font-label-md text-label-md font-bold uppercase tracking-wider shrink-0">
              Latest Announcement:
            </div>
            <div className="text-body-md font-medium truncate flex-grow">
              {announcements[0].content}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[680px] flex items-center overflow-hidden bg-[#000d3d]">
        {/* Background image using next/image with top offset to show head */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image 
            src="/hero.jpeg" 
            alt="PASAL Student Engagement" 
            fill 
            className="object-cover object-[center_12%] opacity-80 transition-opacity duration-300"
            priority 
          />
        </div>
        {/* Deep, immersive overlay gradient tailored to UG Navy brand colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000d3d]/95 via-[#001057]/80 to-[#001057]/30 z-10"></div>
        {/* Subtle top/bottom overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/90 via-transparent to-black/30 z-10"></div>
        
        {/* Decorative gold line/bar at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#fdcc14] via-[#fdcc14]/70 to-transparent z-20" />

        <div className="max-w-[1200px] mx-auto w-full px-container-padding-mobile md:px-container-padding-desktop relative z-20">
          <div className="max-w-2xl text-white slide-up flex flex-col items-start">
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#fdcc14] animate-pulse" />
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-white/90">
                University of Ghana · PASAL Portal
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.15] text-white tracking-tight drop-shadow-sm">
              Your Voice. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fdcc14] to-[#ffe875] font-extrabold">Your Campus.</span> <br />
              Your Future.
            </h1>
            
            <p className="font-body text-base md:text-lg mb-8 text-white/95 max-w-xl leading-relaxed drop-shadow-sm">
              Digitalization is here to stay. PASAL deserves to stand out in aggregating the concerns, ideas, and suggestions of our students. This platform provides a centralized digital space where every voice is heard, valued, and empowered.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="/concerns"
                className="px-6 py-3.5 bg-primary text-white rounded-lg font-bold flex items-center gap-2 hover:bg-primary/95 transition-all shadow-lg active:scale-95 duration-150 border border-white/15"
              >
                <AlertTriangle className="w-5 h-5 text-secondary-container" />
                Submit a Concern
              </Link>
              <Link
                href="/suggestions"
                className="px-6 py-3.5 bg-white/15 text-white border border-white/20 backdrop-blur-md rounded-lg font-bold flex items-center gap-2 hover:bg-white/25 transition-all shadow-lg active:scale-95 duration-150"
              >
                <Lightbulb className="w-5 h-5 text-[#fdcc14]" />
                Submit a Suggestion
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Quick Action Bento Grid Section */}
      <section className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop -mt-10 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/opportunities"
            className="glass-card p-6 rounded-xl flex flex-col gap-4 group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-display text-headline-md text-primary font-bold">
              Explore Opportunities
            </h3>
            <p className="text-on-surface-variant text-body-md">
              Internships, research roles, and student leadership positions await you.
            </p>
            <span className="text-primary font-bold flex items-center gap-2 mt-auto">
              View List <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/events"
            className="glass-card p-6 rounded-xl flex flex-col gap-4 group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-200">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-display text-headline-md text-primary font-bold">
              Upcoming Events
            </h3>
            <p className="text-on-surface-variant text-body-md">
              Stay updated with seminars, workshops, and general assembly meetings.
            </p>
            <span className="text-primary font-bold flex items-center gap-2 mt-auto">
              Calendar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/support"
            className="glass-card p-6 rounded-xl flex flex-col gap-4 group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center text-error group-hover:bg-error group-hover:text-white transition-colors duration-200">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-display text-headline-md text-primary font-bold">
              Need Support?
            </h3>
            <p className="text-on-surface-variant text-body-md">
              Our administration team is ready to assist you with any academic or student inquiries.
            </p>
            <span className="text-primary font-bold flex items-center gap-2 mt-auto">
              Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Engagement Stats Section */}
      <section className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop mt-section-gap">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-primary">
            Engagement at a Glance
          </h2>
          <div className="w-24 h-1 bg-secondary-container mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-8 rounded-xl text-center hover:shadow-lg transition-all duration-300">
            <div className="text-primary font-display text-3xl md:text-4xl font-bold mb-2">
              {loading ? "..." : concerns.length}
            </div>
            <div className="font-label-md text-on-surface-variant">
              Total Concerns
            </div>
          </div>

          <div className="glass-card p-8 rounded-xl text-center hover:shadow-lg transition-all duration-300">
            <div className="text-secondary font-display text-3xl md:text-4xl font-bold mb-2">
              {loading ? "..." : suggestions.length}
            </div>
            <div className="font-label-md text-on-surface-variant">
              Total Suggestions
            </div>
          </div>

          <div className="glass-card p-8 rounded-xl text-center hover:shadow-lg transition-all duration-300">
            <div className="text-primary font-display text-3xl md:text-4xl font-bold mb-2">
              {loading ? "..." : opportunities.length}
            </div>
            <div className="font-label-md text-on-surface-variant">
              Active Jobs/NSS
            </div>
          </div>

          <div className="glass-card p-8 rounded-xl text-center hover:shadow-lg transition-all duration-300">
            <div className="text-primary font-display text-3xl md:text-4xl font-bold mb-2">
              {loading ? "..." : events.length}
            </div>
            <div className="font-label-md text-on-surface-variant">
              Upcoming Events
            </div>
          </div>
        </div>
      </section>

      {/* Campus Selector Section */}
      <section className="bg-surface-container-low mt-section-gap py-16">
        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary">
                Your Campus, Your Voice
              </h2>
              <p className="text-on-surface-variant mt-2">
                Tailored experiences based on your primary learning hub. Select your campus before submission.
              </p>
            </div>
            <div className="flex gap-2 self-end">
              <button
                onClick={slideLeft}
                className="p-2 rounded-full border border-outline-variant hover:bg-white text-primary transition-all active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={slideRight}
                className="p-2 rounded-full border border-outline-variant hover:bg-white text-primary transition-all active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop/Tablet 3 Column Grid vs Mobile Highlight Slider */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campuses.map((campus, idx) => {
              const isHighlighted = idx === activeCampusIndex;
              return (
                <div
                  key={campus.name}
                  className={`group relative overflow-hidden rounded-2xl h-80 cursor-pointer shadow-lg transition-all duration-500 ${
                    isHighlighted ? "ring-4 ring-secondary-container scale-[1.02]" : "opacity-90 md:opacity-100"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${campus.image}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-secondary-container" />
                      <h3 className="font-display text-2xl font-bold">{campus.name}</h3>
                    </div>
                    <p className="text-sm opacity-80 mb-4">{campus.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {campus.students}
                      </span>
                      <Link
                        href={`/concerns?campus=${campus.name.split(" ")[0]}`}
                        className="p-2 bg-white/15 rounded-full hover:bg-white/30 transition-all flex items-center justify-center text-white"
                      >
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Announcements List */}
      <section className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop mt-section-gap">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-3xl font-bold text-primary">
            Recent Announcements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.length === 0 ? (
            <div className="glass-card p-6 rounded-xl text-center text-on-surface-variant md:col-span-2">
              No announcements posted recently.
            </div>
          ) : (
            announcements.slice(0, 4).map((ann) => (
              <div
                key={ann.id}
                className="glass-card p-6 rounded-xl border-l-4 border-l-primary flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-primary mb-2">
                    {ann.title}
                  </h3>
                  <p className="text-on-surface-variant text-body-md mb-4 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
                <div className="text-xs text-on-surface-variant/75">
                  Published: {new Date(ann.created_at).toLocaleDateString("en-GB")}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
