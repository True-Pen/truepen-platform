import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.redirect(new URL("/pricing", "http://localhost:3000"));
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      "http://localhost:3000";

    const siteUrl = origin.startsWith("http") ? origin : `https://${origin}`;

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/account`,
    });

    if (!session.url) {
      return NextResponse.redirect(`${siteUrl}/account`);
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Stripe portal error:", error);

    return NextResponse.redirect(new URL("/account", "http://localhost:3000"));
  }
}