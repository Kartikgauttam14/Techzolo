import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// In-memory contact submissions storage (replace with database in production)
const contactSubmissions = new Map<
  number,
  {
    id: number
    name: string
    email: string
    subject: string
    message: string
    phone?: string
    created_at: string
  }
>()

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Function to send contact form email
async function sendContactEmail(submission: {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  created_at: string
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Contact Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 8px 0;">${submission.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;">${submission.email}</td>
            </tr>
            ${submission.phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${submission.phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 8px 0;">${submission.subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Submitted:</td>
              <td style="padding: 8px 0;">${new Date(submission.created_at).toLocaleString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
          <div style="white-space: pre-wrap; color: #334155; line-height: 1.6;">${submission.message}</div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">
          <p>This contact form submission was received from your Tech Zolo website.</p>
          <p>Submission ID: #${submission.id}</p>
        </div>
      </div>
    `

    const emailText = `
New Contact Form Submission
==========================

Name: ${submission.name}
Email: ${submission.email}
${submission.phone ? `Phone: ${submission.phone}\n` : ''}Subject: ${submission.subject}
Submitted: ${new Date(submission.created_at).toLocaleString()}

Message:
${submission.message}

-------------------------
Submission ID: #${submission.id}
This contact form submission was received from your Tech Zolo website.
    `

    // Send email to your email address
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: `New Contact Form: ${submission.subject}`,
      text: emailText,
      html: emailHtml,
    })

    // Also send a confirmation email to the person who submitted the form
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Thank You for Contacting Us!</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Hi ${submission.name},</p>
          <p>Thank you for reaching out to us through our website. We have received your message and will get back to you as soon as possible.</p>
          
          <h3 style="color: #1e293b;">Your Message Details:</h3>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <p><strong>Subject:</strong> ${submission.subject}</p>
            <p><strong>Submitted:</strong> ${new Date(submission.created_at).toLocaleString()}</p>
            <p><strong>Reference ID:</strong> #${submission.id}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">
          <p>Best regards,<br>Tech Zolo Team</p>
        </div>
      </div>
    `

    const confirmationText = `
Thank You for Contacting Us!

Hi ${submission.name},

Thank you for reaching out to us through our website. We have received your message and will get back to you as soon as possible.

Your Message Details:
Subject: ${submission.subject}
Submitted: ${new Date(submission.created_at).toLocaleString()}
Reference ID: #${submission.id}

Best regards,
Tech Zolo Team
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: submission.email,
      subject: `We received your message: ${submission.subject}`,
      text: confirmationText,
      html: confirmationHtml,
    })

    console.log("Contact form emails sent successfully - notification to admin and confirmation to user")
  } catch (error) {
    console.error("Failed to send contact email:", error)
    // Don't throw error - we don't want email failures to prevent form submission
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, phone } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ detail: "Name, email, subject, and message are required" }, { status: 400 })
    }

    const submissionId = contactSubmissions.size + 1
    const submission = {
      id: submissionId,
      name,
      email,
      subject,
      message,
      phone: phone || undefined,
      created_at: new Date().toISOString(),
    }

    contactSubmissions.set(submissionId, submission)

    console.log("Contact form submission received:", submission)

    // Send email notification
    await sendContactEmail(submission)

    return NextResponse.json({
      message: "Contact form submitted successfully",
      id: submissionId,
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
