import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const subject = String(formData.get("subject") || "");
    const message = String(formData.get("message") || "");

    await resend.emails.send({
      from: "TruePen Support <onboarding@resend.dev>",
      to: "truepenplatform@gmail.com",
      subject: `[TruePen Support] ${subject}`,
      html: `
        <h2>New TruePen support request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message}</p>
      `,
    });

    return NextResponse.redirect(new URL("/support?sent=true", req.url), 303);
  } catch (error) {
    console.error("Support email error:", error);
    return NextResponse.redirect(new URL("/support?error=true", req.url), 303);
  }
}