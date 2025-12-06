import { supabase } from "../supabase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function submitContactMessage(
  name: string,
  email: string,
  message: string
) {
  // Save to Supabase
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({ name, email, message })
    .select()
    .single();

  if (error) throw error;

  // Send to webhook (fire and forget with no-cors to avoid CORS issues)
  const webhookUrl = import.meta.env.VITE_CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      // Use URLSearchParams for form-data style submission
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      formData.append("timestamp", new Date().toISOString());

      fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }).catch(() => {
        // Silently ignore webhook errors
      });
    } catch (webhookError) {
      // Don't throw - message is already saved to database
    }
  }

  return data;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
  return data || [];
}

export async function markMessageAsRead(id: string) {
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteContactMessage(id: string) {
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getUnreadCount(): Promise<number> {
  const { count, error } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
  return count || 0;
}
