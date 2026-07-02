"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { db, Concern } from "@/lib/supabase";
import { 
  AlertTriangle, 
  MapPin, 
  User as UserIcon, 
  EyeOff, 
  Send, 
  Info, 
  Search, 
  CheckCircle,
  HelpCircle,
  Eye
} from "lucide-react";

function ConcernsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Data State
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [filteredConcerns, setFilteredConcerns] = useState<Concern[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [campus, setCampus] = useState("");
  const [level, setLevel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCampusFilter, setActiveCampusFilter] = useState("All");

  // UI Toast State
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Pre-fill campus from URL parameter
  useEffect(() => {
    const campusParam = searchParams.get("campus");
    if (campusParam && ["Main", "City", "Satellite"].includes(campusParam)) {
      setCampus(campusParam);
    }
  }, [searchParams]);

  // Load Concerns
  useEffect(() => {
    async function loadConcerns() {
      try {
        const list = await db.getConcerns();
        setConcerns(list);
      } catch (err) {
        console.error("Failed to load concerns:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConcerns();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = concerns;

    // Filter by Campus
    if (activeCampusFilter !== "All") {
      result = result.filter(c => c.campus === activeCampusFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }

    setFilteredConcerns(result);
  }, [concerns, activeCampusFilter, searchQuery]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campus || !title || !description) return;

    setSubmitting(true);
    try {
      const added = await db.addConcern({
        campus: campus as Concern["campus"],
        level: level ? (level as Concern["level"]) : undefined,
        title,
        description,
        anonymous,
        username: anonymous ? undefined : username || "Student",
      });

      // Update local state list
      setConcerns(prev => [added, ...prev]);

      // Clear Form
      setTitle("");
      setDescription("");
      setAnonymous(false);
      setUsername("");
      setCampus("");
      setLevel("");

      // Trigger success Toast
      setToastMessage("Concern submitted successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      console.error(err);
      setToastMessage("An error occurred. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
      {/* Toast Notification */}
      <div 
        className={`fixed top-20 right-8 z-[100] transition-all duration-300 transform ${
          showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="bg-primary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md">
          <CheckCircle className="w-5 h-5 text-secondary-container" />
          <p className="font-label-md text-sm font-semibold">{toastMessage}</p>
        </div>
      </div>

      {/* Header Section */}
      <header className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 text-primary">
          Student Voice Portal
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          Shape the future of Public Administration at the University of Ghana. Submit your concerns or innovative suggestions directly to the PASAL administration.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Form Column */}
        <section className="lg:col-span-5 space-y-gutter">
          <div className="glass-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            {/* Tab Switcher */}
            <div className="flex border-b border-outline-variant mb-8">
              <button 
                onClick={() => router.push("/concerns")}
                className="flex-1 py-3 font-display font-semibold transition-all border-b-2 border-secondary-container text-primary"
              >
                Concern
              </button>
              <button 
                onClick={() => router.push("/suggestions")}
                className="flex-1 py-3 font-display font-semibold text-on-surface-variant transition-all hover:text-primary"
              >
                Suggestion
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Campus Choice */}
              <div className="space-y-2">
                <label className="block font-label-sm text-xs font-bold text-on-surface-variant tracking-wider">
                  SELECT CAMPUS
                </label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  required
                >
                  <option value="" disabled>Choose a campus...</option>
                  <option value="Main">Main Campus</option>
                  <option value="City">City Campus</option>
                  <option value="Satellite">Satellite Campus</option>
                </select>
              </div>

              {/* Level Selection */}
              <div className="space-y-2">
                <label className="block font-label-sm text-xs font-bold text-on-surface-variant tracking-wider">
                  LEVEL
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                >
                  <option value="" disabled>Select your level</option>
                  <option value="100">Level 100</option>
                  <option value="200">Level 200</option>
                  <option value="300">Level 300</option>
                  <option value="400">Level 400</option>
                </select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="block font-label-sm text-xs font-bold text-on-surface-variant tracking-wider">
                  TITLE
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your point..."
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block font-label-sm text-xs font-bold text-on-surface-variant tracking-wider">
                  DETAILED DESCRIPTION
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context and details..."
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  rows={4}
                  required
                />
              </div>

              {/* Anonymous Toggle */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface">
                    <EyeOff className="w-5 h-5 text-primary" />
                    <span className="font-label-md text-sm font-semibold">Submit Anonymously</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Username Input (Conditional) */}
                {!anonymous && (
                  <div className="space-y-2 transition-all duration-300">
                    <label className="block font-label-sm text-xs font-bold text-on-surface-variant tracking-wider">
                      USERNAME (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your name or index number"
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-lg font-display font-bold text-body-md hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>

          {/* Guidance Card */}
          <div className="bg-secondary-container/20 p-6 rounded-xl border border-secondary/20 flex gap-4">
            <Info className="w-6 h-6 text-secondary shrink-0" />
            <div>
              <p className="font-label-md text-sm text-secondary font-bold uppercase tracking-wider">
                Portal Guidelines
              </p>
              <p className="text-body-md text-xs text-on-secondary-fixed-variant mt-1 leading-relaxed">
                Please ensure your submissions are constructive. Concerns are reviewed within 48 hours by the Student Affairs committee.
              </p>
            </div>
          </div>
        </section>

        {/* Right Concerns List Column */}
        <section className="lg:col-span-7 space-y-6">
          {/* Filters Bar */}
          <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search concerns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-outline-variant rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              <span className="text-xs font-bold text-on-surface-variant whitespace-nowrap">
                CAMPUS:
              </span>
              <div className="flex gap-2">
                {["All", "Main", "City", "Satellite"].map((camp) => (
                  <button
                    key={camp}
                    onClick={() => setActiveCampusFilter(camp)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold font-label-md transition-all whitespace-nowrap active:scale-95 ${
                      activeCampusFilter === camp
                        ? "bg-primary text-white"
                        : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                  >
                    {camp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Concerns Feed */}
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="glass-card p-8 rounded-xl text-center text-on-surface-variant animate-pulse">
                Loading concerns...
              </div>
            ) : filteredConcerns.length === 0 ? (
              <div className="glass-card p-8 rounded-xl text-center text-on-surface-variant flex flex-col items-center gap-2">
                <HelpCircle className="w-8 h-8 text-on-surface-variant/50" />
                No concerns found. Be the first to share one!
              </div>
            ) : (
              filteredConcerns.map((item, index) => {
                const isPending = item.status === "Pending";
                const isReviewed = item.status === "Reviewed";
                const isResolved = item.status === "Resolved";

                return (
                  <div
                    key={item.id}
                    className={`glass-card p-6 rounded-xl border-l-4 slide-up flex flex-col justify-between hover:shadow-md transition-shadow ${
                      isPending 
                        ? "border-l-amber-500" 
                        : isReviewed 
                        ? "border-l-blue-500" 
                        : "border-l-green-500"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Concern
                          </span>
                          <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.campus} Campus
                          </span>
                        </div>
                        <span className="text-xs italic text-on-surface-variant/75">
                          {new Date(item.created_at).toLocaleDateString("en-GB")}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl text-primary mb-2">
                        {item.title}
                      </h3>
                      <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        {item.anonymous ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span className="text-xs font-medium">Anonymous Student</span>
                          </>
                        ) : (
                          <>
                            <UserIcon className="w-4 h-4" />
                            <span className="text-xs font-medium">{item.username || "Student"}</span>
                          </>
                        )}
                      </div>

                      {/* Status indicator */}
                      <div>
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                            isPending 
                              ? "bg-amber-100 text-amber-800 border border-amber-200" 
                              : isReviewed 
                              ? "bg-blue-100 text-blue-800 border border-blue-200" 
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}
                        >
                          {isPending ? "Going on" : isReviewed ? "In Progress" : "Solved / Finished"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ConcernsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
        <div className="glass-card p-8 rounded-xl text-center text-on-surface-variant">
          Loading Page Content...
        </div>
      </div>
    }>
      <ConcernsContent />
    </Suspense>
  );
}
