import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";

// --- Interfaces ---

export interface HeroData {
  id?: string;
  greeting: string;
  name: string;
  titles: string[];
  description: string;
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
  };
}

export interface AboutData {
  id?: string;
  summary: string;
  skills: string[];
  experience: {
    id?: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    id?: string;
    degree: string;
    school: string;
    period: string;
    description: string;
  }[];
  certifications: {
    id?: string;
    name: string;
    issuer: string;
    date: string;
  }[];
  contact: {
    location: string;
    phone: string;
    email: string;
  };
}

export interface Project {
  id: string;
  title: string;
  date: string;
  description: string;
  tech: string[];
  type: "web" | "mobile" | "other";
  link?: string;
  image?: string;
  image2?: string;
  image3?: string;
  github?: string;
  features?: string[];
  client?: string;
}

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  features: string[];
  popular: boolean;
  color: string;
  iconType: "bot" | "globe" | "zap";
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image?: string;
  comments: Comment[];
}

export interface DataContextType {
  hero: HeroData;
  about: AboutData;
  projects: Project[];
  pricing: PricingPlan[];
  blog: BlogPost[];
  loading: boolean;
  error: string | null;
  updateHero: (data: HeroData) => Promise<void>;
  updateAbout: (data: AboutData) => Promise<void>;
  addProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updatePricing: (plans: PricingPlan[]) => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, "id" | "comments">) => Promise<void>;
  updateBlogPost: (id: string, post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

// --- Default Data (fallback) ---

const defaultHero: HeroData = {
  greeting: "Hello, World!",
  name: "Muhammad Aenul Fahir",
  titles: ["Full Stack Developer", "Mobile Developer", "UI/UX Enthusiast"],
  description:
    "Building futuristic, high-performance web and mobile applications with modern technologies.",
  socialLinks: { github: "#", linkedin: "#", instagram: "#" },
};

const defaultAbout: AboutData = {
  summary: "",
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  contact: { location: "", phone: "", email: "" },
};

// --- Context & Provider ---

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [about, setAbout] = useState<AboutData>(defaultAbout);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data from Supabase
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch profile (hero)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .single();

      if (profileData) {
        setHero({
          id: profileData.id,
          greeting: profileData.greeting,
          name: profileData.name,
          titles: profileData.titles,
          description: profileData.description || "",
          socialLinks: {
            github: profileData.github_url || "#",
            linkedin: profileData.linkedin_url || "#",
            instagram: profileData.instagram_url || "#",
          },
        });
      }

      // Fetch about with related data
      const { data: aboutData } = await supabase
        .from("about")
        .select("*")
        .single();

      if (aboutData) {
        const [skillsRes, expRes, eduRes, certRes] = await Promise.all([
          supabase
            .from("skills")
            .select("*")
            .eq("about_id", aboutData.id)
            .order("order_index"),
          supabase
            .from("experiences")
            .select("*")
            .eq("about_id", aboutData.id)
            .order("order_index"),
          supabase
            .from("education")
            .select("*")
            .eq("about_id", aboutData.id)
            .order("order_index"),
          supabase
            .from("certifications")
            .select("*")
            .eq("about_id", aboutData.id)
            .order("order_index"),
        ]);

        setAbout({
          id: aboutData.id,
          summary: aboutData.summary || "",
          skills: skillsRes.data?.map((s) => s.name) || [],
          experience:
            expRes.data?.map((e) => ({
              id: e.id,
              role: e.role,
              company: e.company,
              period: e.period,
              description: e.description || "",
            })) || [],
          education:
            eduRes.data?.map((e) => ({
              id: e.id,
              degree: e.degree,
              school: e.school,
              period: e.period,
              description: e.description || "",
            })) || [],
          certifications:
            certRes.data?.map((c) => ({
              id: c.id,
              name: c.name,
              issuer: c.issuer,
              date: c.date,
            })) || [],
          contact: {
            location: aboutData.location || "",
            phone: aboutData.phone || "",
            email: aboutData.email || "",
          },
        });
      }

      // Fetch projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .order("order_index");

      if (projectsData) {
        setProjects(
          projectsData.map((p) => ({
            id: p.id,
            title: p.title,
            date: p.date,
            description: p.description || "",
            tech: p.tech || [],
            type: p.type as "web" | "mobile" | "other",
            link: p.link || undefined,
            image: p.image || undefined,
            image2: p.image2 || undefined,
            image3: p.image3 || undefined,
            github: p.github || undefined,
            features: p.features || undefined,
            client: p.client || undefined,
          }))
        );
      }

      // Fetch pricing
      const { data: pricingData } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("order_index");

      if (pricingData) {
        setPricing(
          pricingData.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            features: p.features || [],
            popular: p.popular,
            color: p.color,
            iconType: p.icon_type as "bot" | "globe" | "zap",
          }))
        );
      }

      // Fetch blog posts with comments
      const { data: blogData } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (blogData) {
        const postsWithComments = await Promise.all(
          blogData.map(async (post) => {
            const { data: comments } = await supabase
              .from("blog_comments")
              .select("*")
              .eq("blog_post_id", post.id)
              .order("created_at");

            return {
              id: post.id,
              title: post.title,
              excerpt: post.excerpt || "",
              content: post.content,
              date: post.date,
              author: post.author,
              category: post.category,
              image: post.image || undefined,
              comments:
                comments?.map((c) => ({
                  id: c.id,
                  user: c.user_name,
                  text: c.text,
                  date: c.date,
                })) || [],
            };
          })
        );
        setBlog(postsWithComments);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data from database");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Update Functions
  const updateHero = async (data: HeroData) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          greeting: data.greeting,
          name: data.name,
          titles: data.titles,
          description: data.description,
          github_url: data.socialLinks.github,
          linkedin_url: data.socialLinks.linkedin,
          instagram_url: data.socialLinks.instagram,
        })
        .eq("id", hero.id);

      if (error) throw error;
      setHero(data);
    } catch (err) {
      console.error("Error updating hero:", err);
      throw err;
    }
  };

  const updateAbout = async (data: AboutData) => {
    try {
      const { error } = await supabase
        .from("about")
        .update({
          summary: data.summary,
          location: data.contact.location,
          phone: data.contact.phone,
          email: data.contact.email,
        })
        .eq("id", about.id);

      if (error) throw error;
      setAbout(data);
    } catch (err) {
      console.error("Error updating about:", err);
      throw err;
    }
  };

  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          title: project.title,
          date: project.date,
          description: project.description,
          tech: project.tech,
          type: project.type,
          link: project.link || null,
          image: (project as any).image || null,
          image2: (project as any).image2 || null,
          image3: (project as any).image3 || null,
          github: (project as any).github || null,
          features: (project as any).features || null,
          client: (project as any).client || null,
          order_index: projects.length,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProjects([
          ...projects,
          {
            id: data.id,
            title: data.title,
            date: data.date,
            description: data.description || "",
            tech: data.tech || [],
            type: data.type as "web" | "mobile" | "other",
            link: data.link || undefined,
            image: data.image || undefined,
            image2: data.image2 || undefined,
            image3: data.image3 || undefined,
            github: data.github || undefined,
            features: data.features || undefined,
            client: data.client || undefined,
          },
        ]);
      }
    } catch (err) {
      console.error("Error adding project:", err);
      throw err;
    }
  };

  const updateProject = async (id: string, project: Project) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          title: project.title,
          date: project.date,
          description: project.description,
          tech: project.tech,
          type: project.type,
          link: project.link || null,
          image: project.image || null,
          image2: project.image2 || null,
          image3: project.image3 || null,
          github: project.github || null,
          features: project.features || null,
          client: project.client || null,
        })
        .eq("id", id);

      if (error) throw error;
      setProjects(projects.map((p) => (p.id === id ? project : p)));
    } catch (err) {
      console.error("Error updating project:", err);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      throw err;
    }
  };

  const updatePricing = async (plans: PricingPlan[]) => {
    try {
      for (const plan of plans) {
        const { error } = await supabase
          .from("pricing_plans")
          .update({
            title: plan.title,
            price: plan.price,
            features: plan.features,
            popular: plan.popular,
            color: plan.color,
            icon_type: plan.iconType,
          })
          .eq("id", plan.id);

        if (error) throw error;
      }
      setPricing(plans);
    } catch (err) {
      console.error("Error updating pricing:", err);
      throw err;
    }
  };

  const addBlogPost = async (post: Omit<BlogPost, "id" | "comments">) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          date: post.date,
          author: post.author,
          category: post.category,
          image: post.image || null,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setBlog([
          {
            id: data.id,
            title: data.title,
            excerpt: data.excerpt || "",
            content: data.content,
            date: data.date,
            author: data.author,
            category: data.category,
            image: data.image || undefined,
            comments: [],
          },
          ...blog,
        ]);
      }
    } catch (err) {
      console.error("Error adding blog post:", err);
      throw err;
    }
  };

  const updateBlogPost = async (id: string, post: BlogPost) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          date: post.date,
          author: post.author,
          category: post.category,
          image: post.image || null,
        })
        .eq("id", id);

      if (error) throw error;
      setBlog(blog.map((p) => (p.id === id ? post : p)));
    } catch (err) {
      console.error("Error updating blog post:", err);
      throw err;
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);

      if (error) throw error;
      setBlog(blog.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting blog post:", err);
      throw err;
    }
  };

  return (
    <DataContext.Provider
      value={{
        hero,
        about,
        projects,
        pricing,
        blog,
        loading,
        error,
        updateHero,
        updateAbout,
        addProject,
        updateProject,
        deleteProject,
        updatePricing,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        refreshData: fetchAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
