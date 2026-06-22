import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// --- TYPES ---
export interface Concern {
  id: string;
  campus: "Main" | "City" | "Satellite";
  title: string;
  description: string;
  anonymous: boolean;
  username?: string;
  status: "Pending" | "Reviewed" | "Resolved";
  created_at: string;
}

export interface Suggestion {
  id: string;
  campus: "Main" | "City" | "Satellite";
  title: string;
  description: string;
  anonymous: boolean;
  username?: string;
  created_at: string;
  likes: number; // For upvoting suggestions
}

export interface Opportunity {
  id: string;
  title: string;
  category: "Internship" | "National Service";
  description: string;
  application_link: string;
  deadline: string;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  venue: string;
  event_date: string;
  banner_url?: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

// --- MOCK STORAGE FALLBACKS ---
const isClient = typeof window !== "undefined";

const defaultConcerns: Concern[] = [
  {
    id: "UG-7721",
    campus: "Main",
    title: "Insufficient Study Spaces in JQB",
    description: "The Jones Quartey Building currently lacks enough seating for students between lectures. Many are forced to sit on stairwells.",
    anonymous: true,
    status: "Pending",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "UG-7719",
    campus: "City",
    title: "Registration Portal Access Issues",
    description: "Students are unable to access the course registration portal during peak hours, causing delays in finalizing timetables.",
    anonymous: false,
    username: "Abena Boateng",
    status: "Reviewed",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "UG-7692",
    campus: "Satellite",
    title: "Library Wi-Fi Connectivity Dropouts",
    description: "The wireless internet connection in the library study hall drops frequently every afternoon, disrupting online study.",
    anonymous: false,
    username: "John Doe",
    status: "Resolved",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const defaultSuggestions: Suggestion[] = [
  {
    id: "SUG-001",
    campus: "Main",
    title: "Digital Thesis Submission Portal",
    description: "We should move to a completely paperless thesis submission process to save paper costs and speed up approval times.",
    anonymous: false,
    username: "Kojo Mensah",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 45,
  },
  {
    id: "SUG-002",
    campus: "City",
    title: "Solar Panel Installation on Main PASAL Hall",
    description: "Utilizing the rooftop of the PASAL building for solar energy harvesting to combat local power fluctuations.",
    anonymous: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: 128,
  },
  {
    id: "SUG-003",
    campus: "Satellite",
    title: "Inter-College Debate Series",
    description: "Creating a formal debate league within the department to foster public speaking and research amongst students.",
    anonymous: false,
    username: "Dr. Amma Addo",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 67,
  },
];

const defaultOpportunities: Opportunity[] = [
  {
    id: "OPP-001",
    title: "Policy Research Intern",
    category: "Internship",
    description: "Join the Ministry of Foreign Affairs for a 3-month research intensive focusing on West African trade relations.",
    application_link: "https://mfa.gov.gh/careers",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "OPP-002",
    title: "Administrative Assistant",
    category: "National Service",
    description: "Position available at the University of Ghana Registry. High potential for long-term placement based on performance.",
    application_link: "https://ug.edu.gh/nss",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

const defaultEvents: EventItem[] = [
  {
    id: "EVT-001",
    title: "Careers in Civil Service Talk",
    description: "Learn how to start a career in administrative and diplomatic services directly from leaders in the public sector.",
    venue: "JQB Room 14",
    event_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    banner_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "EVT-002",
    title: "PASAL Networking Mixer",
    description: "Connect with alumni, professors, and peer leaders on the department lawn. Food and drinks provided.",
    venue: "Department Lawns",
    event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    banner_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    created_at: new Date().toISOString(),
  },
];

const defaultAnnouncements: Announcement[] = [
  {
    id: "ANN-001",
    title: "Mid-Semester Examinations Schedule Released",
    content: "The official timetable for the mid-semester exams has been posted on the main board. Please review details before classes.",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ANN-002",
    title: "PASAL Week Celebrations Upcoming",
    content: "Prepare for our annual celebration week starting next Monday. Details for event signups will be published soon.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// In-Memory Fallbacks for SSR / Development
let serverConcerns = [...defaultConcerns];
let serverSuggestions = [...defaultSuggestions];
let serverOpportunities = [...defaultOpportunities];
let serverEvents = [...defaultEvents];
let serverAnnouncements = [...defaultAnnouncements];

function getStored<T>(key: string, serverFallback: T[]): T[] {
  if (!isClient) return serverFallback;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(serverFallback));
    return serverFallback;
  }
  return JSON.parse(stored);
}

function setStored<T>(key: string, data: T[], setter: (val: T[]) => void) {
  setter(data);
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// --- DATABASE OPERATIONS WRAPPER ---
export const db = {
  // CONCERNS
  async getConcerns(): Promise<Concern[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("concerns")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as Concern[];
      console.error("Supabase getConcerns error:", error);
    }
    return getStored("pasal_concerns", serverConcerns);
  },

  async addConcern(concern: Omit<Concern, "id" | "status" | "created_at">): Promise<Concern> {
    const newConcern: Concern = {
      ...concern,
      id: "UG-" + Math.floor(1000 + Math.random() * 9000),
      status: "Pending",
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("concerns")
        .insert([concern])
        .select()
        .single();
      if (!error && data) return data as Concern;
      console.error("Supabase addConcern error, using memory:", error);
    }
    const current = getStored("pasal_concerns", serverConcerns);
    const updated = [newConcern, ...current];
    setStored("pasal_concerns", updated, (v) => {
      serverConcerns = v;
    });
    return newConcern;
  },

  async updateConcernStatus(id: string, status: Concern["status"]): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("concerns")
        .update({ status })
        .eq("id", id);
      if (!error) return true;
      console.error("Supabase updateConcernStatus error:", error);
    }
    const current = getStored("pasal_concerns", serverConcerns);
    const updated = current.map((c) => (c.id === id ? { ...c, status } : c));
    setStored("pasal_concerns", updated, (v) => {
      serverConcerns = v;
    });
    return true;
  },

  // SUGGESTIONS
  async getSuggestions(): Promise<Suggestion[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("suggestions")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as Suggestion[];
      console.error("Supabase getSuggestions error:", error);
    }
    return getStored("pasal_suggestions", serverSuggestions);
  },

  async addSuggestion(suggestion: Omit<Suggestion, "id" | "created_at" | "likes">): Promise<Suggestion> {
    const newSuggestion: Suggestion = {
      ...suggestion,
      id: "SUG-" + Math.floor(100 + Math.random() * 900),
      created_at: new Date().toISOString(),
      likes: 0,
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("suggestions")
        .insert([suggestion])
        .select()
        .single();
      if (!error && data) return data as Suggestion;
      console.error("Supabase addSuggestion error, using memory:", error);
    }
    const current = getStored("pasal_suggestions", serverSuggestions);
    const updated = [newSuggestion, ...current];
    setStored("pasal_suggestions", updated, (v) => {
      serverSuggestions = v;
    });
    return newSuggestion;
  },

  async likeSuggestion(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      // In production, we'd do a rpc or increment query
      const { error } = await supabase.rpc("increment_likes", { row_id: id });
      if (!error) return true;
      console.error("Supabase likeSuggestion rpc failed, running local update:", error);
    }
    const current = getStored("pasal_suggestions", serverSuggestions);
    const updated = current.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s));
    setStored("pasal_suggestions", updated, (v) => {
      serverSuggestions = v;
    });
    return true;
  },

  // OPPORTUNITIES
  async getOpportunities(): Promise<Opportunity[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("deadline", { ascending: true });
      if (!error && data) return data as Opportunity[];
      console.error("Supabase getOpportunities error:", error);
    }
    return getStored("pasal_opportunities", serverOpportunities);
  },

  async addOpportunity(opp: Omit<Opportunity, "id" | "created_at">): Promise<Opportunity> {
    const newOpp: Opportunity = {
      ...opp,
      id: "OPP-" + Math.floor(100 + Math.random() * 900),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("opportunities")
        .insert([opp])
        .select()
        .single();
      if (!error && data) return data as Opportunity;
      console.error("Supabase addOpportunity error:", error);
    }
    const current = getStored("pasal_opportunities", serverOpportunities);
    const updated = [newOpp, ...current];
    setStored("pasal_opportunities", updated, (v) => {
      serverOpportunities = v;
    });
    return newOpp;
  },

  async deleteOpportunity(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("opportunities").delete().eq("id", id);
      if (!error) return true;
    }
    const current = getStored("pasal_opportunities", serverOpportunities);
    const updated = current.filter((o) => o.id !== id);
    setStored("pasal_opportunities", updated, (v) => {
      serverOpportunities = v;
    });
    return true;
  },

  // EVENTS
  async getEvents(): Promise<EventItem[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      if (!error && data) return data as EventItem[];
      console.error("Supabase getEvents error:", error);
    }
    return getStored("pasal_events", serverEvents);
  },

  async addEvent(event: Omit<EventItem, "id" | "created_at">): Promise<EventItem> {
    const newEvent: EventItem = {
      ...event,
      id: "EVT-" + Math.floor(100 + Math.random() * 900),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("events")
        .insert([event])
        .select()
        .single();
      if (!error && data) return data as EventItem;
      console.error("Supabase addEvent error:", error);
    }
    const current = getStored("pasal_events", serverEvents);
    const updated = [newEvent, ...current];
    setStored("pasal_events", updated, (v) => {
      serverEvents = v;
    });
    return newEvent;
  },

  async deleteEvent(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (!error) return true;
    }
    const current = getStored("pasal_events", serverEvents);
    const updated = current.filter((e) => e.id !== id);
    setStored("pasal_events", updated, (v) => {
      serverEvents = v;
    });
    return true;
  },

  // ANNOUNCEMENTS
  async getAnnouncements(): Promise<Announcement[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as Announcement[];
      console.error("Supabase getAnnouncements error:", error);
    }
    return getStored("pasal_announcements", serverAnnouncements);
  },

  async addAnnouncement(ann: Omit<Announcement, "id" | "created_at">): Promise<Announcement> {
    const newAnn: Announcement = {
      ...ann,
      id: "ANN-" + Math.floor(100 + Math.random() * 900),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("announcements")
        .insert([ann])
        .select()
        .single();
      if (!error && data) return data as Announcement;
      console.error("Supabase addAnnouncement error:", error);
    }
    const current = getStored("pasal_announcements", serverAnnouncements);
    const updated = [newAnn, ...current];
    setStored("pasal_announcements", updated, (v) => {
      serverAnnouncements = v;
    });
    return newAnn;
  },
};
