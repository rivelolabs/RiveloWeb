import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, projectType, budget, timeline, description, details } = body;

    // Log the received project inquiry
    console.log("=== NEW PROJECT INQUIRY FOR RIVENO ===");
    console.log("Target:", "hello@rivelolabs.com");
    console.log("From:", name, `(${email})`);
    console.log("Mobile / Phone:", phone || "Not provided");
    console.log("Type:", projectType);
    console.log("Budget:", budget);
    console.log("Timeline:", timeline);
    console.log("Description:", description);
    console.log("Additional Details:", details);
    console.log("Timestamp:", new Date().toISOString());
    console.log("======================================");

    // Formatted mailto link for direct fallback if client wants to trigger mail app
    const subject = encodeURIComponent(`New Project Inquiry from ${name || "Client"}: ${projectType || "Custom Project"}`);
    const mailBody = encodeURIComponent(
      `Hello Rivelo Labs Team,\n\nI would like to discuss a project with you.\n\n` +
      `• Client Name: ${name || "N/A"}\n` +
      `• Work Email: ${email || "N/A"}\n` +
      `• Mobile / Phone: ${phone || "N/A"}\n` +
      `• Project Type: ${projectType || "N/A"}\n` +
      `• Estimated Budget: ${budget || "N/A"}\n` +
      `• Expected Timeline: ${timeline || "N/A"}\n\n` +
      `• Project Description:\n${description || "N/A"}\n\n` +
      `Looking forward to hearing from you!\n`
    );
    const mailtoUrl = `mailto:hello@rivelolabs.com?subject=${subject}&body=${mailBody}`;

    return NextResponse.json({
      success: true,
      message: "Project inquiry received! We'll reach out to you within 24 hours.",
      targetEmail: "hello@rivelolabs.com",
      mailtoUrl,
      receivedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Error processing project submission:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process project inquiry" },
      { status: 500 }
    );
  }
}
