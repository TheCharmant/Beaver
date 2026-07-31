import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  project: z.string().trim().min(10).max(3000),
});

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all fields correctly." }, { status: 400 });
  }

  const { RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !RESEND_TO_EMAIL) {
    return NextResponse.json({ error: "Email delivery has not been configured yet." }, { status: 503 });
  }

  const { name, email, project } = parsed.data;
  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: [RESEND_TO_EMAIL],
    replyTo: email,
    subject: `New Beaver inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nProject:\n${project}`,
  });

  if (error) {
    console.error("Resend contact email failed", error);
    return NextResponse.json({ error: "We couldn't send your inquiry. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
