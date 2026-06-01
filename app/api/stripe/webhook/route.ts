import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature failed:", err);

    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.user_id;

      if (userId) {
        await supabase
          .from("profiles")
          .update({
            plan: "pro",
            stripe_customer_id: session.customer?.toString() ?? null,
            stripe_subscription_id:
              session.subscription?.toString() ?? null,
          })
          .eq("id", userId);

        console.log("User upgraded to PRO:", userId);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from("profiles")
        .update({
          plan: "free",
        })
        .eq("stripe_subscription_id", subscription.id);

      console.log("Subscription cancelled:", subscription.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 },
    );
  }
}