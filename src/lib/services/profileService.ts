import { supabase } from "../supabase";

export interface ProfileData {
  id: string;
  greeting: string;
  name: string;
  titles: string[];
  description: string;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
}

export interface AboutData {
  id: string;
  summary: string;
  location: string;
  phone: string;
  email: string;
  skills: { id: string; name: string }[];
  experiences: {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    id: string;
    degree: string;
    school: string;
    period: string;
    description: string;
  }[];
  certifications: { id: string; name: string; issuer: string; date: string }[];
}

export async function getProfile(): Promise<ProfileData | null> {
  const { data, error } = await supabase.from("profiles").select("*").single();

  if (error || !data) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return {
    id: data.id,
    greeting: data.greeting,
    name: data.name,
    titles: data.titles || [],
    description: data.description || "",
    github_url: data.github_url,
    linkedin_url: data.linkedin_url,
    instagram_url: data.instagram_url,
  };
}

export async function getAboutData(): Promise<AboutData | null> {
  const { data: about, error: aboutError } = await supabase
    .from("about")
    .select("*")
    .single();

  if (aboutError || !about) {
    console.error("Error fetching about:", aboutError);
    return null;
  }

  const [skills, experiences, education, certifications] = await Promise.all([
    supabase
      .from("skills")
      .select("*")
      .eq("about_id", about.id)
      .order("order_index"),
    supabase
      .from("experiences")
      .select("*")
      .eq("about_id", about.id)
      .order("order_index"),
    supabase
      .from("education")
      .select("*")
      .eq("about_id", about.id)
      .order("order_index"),
    supabase
      .from("certifications")
      .select("*")
      .eq("about_id", about.id)
      .order("order_index"),
  ]);

  return {
    id: about.id,
    summary: about.summary || "",
    location: about.location || "",
    phone: about.phone || "",
    email: about.email || "",
    skills: (skills.data || []).map((s) => ({ id: s.id, name: s.name })),
    experiences: (experiences.data || []).map((e) => ({
      id: e.id,
      role: e.role,
      company: e.company,
      period: e.period,
      description: e.description || "",
    })),
    education: (education.data || []).map((e) => ({
      id: e.id,
      degree: e.degree,
      school: e.school,
      period: e.period,
      description: e.description || "",
    })),
    certifications: (certifications.data || []).map((c) => ({
      id: c.id,
      name: c.name,
      issuer: c.issuer,
      date: c.date,
    })),
  };
}

export async function updateProfile(id: string, data: Partial<ProfileData>) {
  const { error } = await supabase
    .from("profiles")
    .update({
      greeting: data.greeting,
      name: data.name,
      titles: data.titles,
      description: data.description,
      github_url: data.github_url,
      linkedin_url: data.linkedin_url,
      instagram_url: data.instagram_url,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function updateAbout(id: string, data: Partial<AboutData>) {
  const { error } = await supabase
    .from("about")
    .update({
      summary: data.summary,
      location: data.location,
      phone: data.phone,
      email: data.email,
    })
    .eq("id", id);

  if (error) throw error;
}
