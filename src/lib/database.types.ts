export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          greeting: string;
          name: string;
          titles: string[];
          description: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          instagram_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          greeting?: string;
          name: string;
          titles?: string[];
          description?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          greeting?: string;
          name?: string;
          titles?: string[];
          description?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      about: {
        Row: {
          id: string;
          profile_id: string | null;
          summary: string | null;
          location: string | null;
          phone: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          summary?: string | null;
          location?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          summary?: string | null;
          location?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          about_id: string | null;
          name: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          about_id?: string | null;
          name: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          about_id?: string | null;
          name?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          about_id: string | null;
          role: string;
          company: string;
          period: string;
          description: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          about_id?: string | null;
          role: string;
          company: string;
          period: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          about_id?: string | null;
          role?: string;
          company?: string;
          period?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          about_id: string | null;
          degree: string;
          school: string;
          period: string;
          description: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          about_id?: string | null;
          degree: string;
          school: string;
          period: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          about_id?: string | null;
          degree?: string;
          school?: string;
          period?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      certifications: {
        Row: {
          id: string;
          about_id: string | null;
          name: string;
          issuer: string;
          date: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          about_id?: string | null;
          name: string;
          issuer: string;
          date: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          about_id?: string | null;
          name?: string;
          issuer?: string;
          date?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          date: string;
          description: string | null;
          tech: string[];
          type: string;
          link: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          description?: string | null;
          tech?: string[];
          type?: string;
          link?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          date?: string;
          description?: string | null;
          tech?: string[];
          type?: string;
          link?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      pricing_plans: {
        Row: {
          id: string;
          title: string;
          price: string;
          features: string[];
          popular: boolean;
          color: string;
          icon_type: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          price: string;
          features?: string[];
          popular?: boolean;
          color?: string;
          icon_type?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          price?: string;
          features?: string[];
          popular?: boolean;
          color?: string;
          icon_type?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          excerpt: string | null;
          content: string;
          date: string;
          author: string;
          category: string;
          image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt?: string | null;
          content: string;
          date: string;
          author: string;
          category: string;
          image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string | null;
          content?: string;
          date?: string;
          author?: string;
          category?: string;
          image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_comments: {
        Row: {
          id: string;
          blog_post_id: string | null;
          user_name: string;
          text: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          blog_post_id?: string | null;
          user_name: string;
          text: string;
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          blog_post_id?: string | null;
          user_name?: string;
          text?: string;
          date?: string;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
