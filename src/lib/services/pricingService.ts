import { supabase } from "../supabase";

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  features: string[];
  popular: boolean;
  color: string;
  icon_type: "bot" | "globe" | "zap";
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const { data, error } = await supabase
    .from("pricing_plans")
    .select("*")
    .order("order_index");

  if (error) {
    console.error("Error fetching pricing plans:", error);
    return [];
  }
  return (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    features: p.features || [],
    popular: p.popular,
    color: p.color,
    icon_type: p.icon_type as "bot" | "globe" | "zap",
  }));
}

export async function updatePricingPlan(
  id: string,
  plan: Partial<PricingPlan>
) {
  const { error } = await supabase
    .from("pricing_plans")
    .update({
      title: plan.title,
      price: plan.price,
      features: plan.features,
      popular: plan.popular,
      color: plan.color,
      icon_type: plan.icon_type,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function addPricingPlan(plan: Omit<PricingPlan, "id">) {
  const { data, error } = await supabase
    .from("pricing_plans")
    .insert({
      title: plan.title,
      price: plan.price,
      features: plan.features,
      popular: plan.popular,
      color: plan.color,
      icon_type: plan.icon_type,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePricingPlan(id: string) {
  const { error } = await supabase.from("pricing_plans").delete().eq("id", id);

  if (error) throw error;
}
