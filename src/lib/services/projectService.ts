import { supabase } from "../supabase";

export interface Project {
  id: string;
  title: string;
  date: string;
  description: string;
  tech: string[];
  type: "web" | "mobile" | "other";
  link: string | null;
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order_index");

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    date: p.date,
    description: p.description || "",
    tech: p.tech || [],
    type: p.type as "web" | "mobile" | "other",
    link: p.link,
  }));
}

export async function addProject(project: Omit<Project, "id">) {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: project.title,
      date: project.date,
      description: project.description,
      tech: project.tech,
      type: project.type,
      link: project.link,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, project: Partial<Project>) {
  const { error } = await supabase
    .from("projects")
    .update({
      title: project.title,
      date: project.date,
      description: project.description,
      tech: project.tech,
      type: project.type,
      link: project.link,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;
}
