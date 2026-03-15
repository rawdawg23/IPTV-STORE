const nodemailer = require("nodemailer");

// Resend (preferred for contact form)
let ResendClient;
try {
  ResendClient = require("resend").Resend;
} catch (_) {
  ResendClient = null;
}

const RECEIVING_EMAIL =
  process.env.CONTACT_RECEIVING_EMAIL || "hodge2023@outlook.com";
const RESEND_FROM =
  process.env.RESEND_FROM || "Evo Media <onboarding@resend.dev>";

function escapeHtml(s) {
  if (typeof s !== "string") return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Send contact form submission to site owner via Resend (or fallback SMTP).
 * @param {{ name: string, email: string, message: string }} contact
 * @returns {Promise<boolean>} true if sent
 */
async function sendContactNotification(contact) {
  const subject = `[Evo Media] New contact from ${contact.name}`;
  const text = [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    ``,
    `Message:`,
    contact.message,
  ].join("\n");
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>`,
    `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p>`,
    `<p><strong>Message:</strong></p>`,
    `<pre style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:6px;">${escapeHtml(contact.message)}</pre>`,
  ].join("\n");

  // 1) Resend (preferred)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && ResendClient) {
    const resend = new ResendClient(resendKey);
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: [RECEIVING_EMAIL],
      replyTo: contact.email,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("Resend contact email failed:", error?.message || error);
      return false;
    }
    console.log("Contact notification sent via Resend to", RECEIVING_EMAIL, data?.id);
    return true;
  }

  // 2) Fallback: SMTP (nodemailer)
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  if (user && pass) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-mail.outlook.com",
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,
      auth: { user, pass },
      tls: { ciphers: "SSLv3" },
    });
    try {
      await transport.sendMail({
        from: user,
        to: RECEIVING_EMAIL,
        replyTo: contact.email,
        subject,
        text,
        html,
      });
      console.log("Contact notification sent via SMTP to", RECEIVING_EMAIL);
      return true;
    } catch (err) {
      console.error("SMTP contact email failed:", err.message);
      return false;
    }
  }

  console.warn(
    "Contact email not sent: set RESEND_API_KEY (recommended) or EMAIL_USER/EMAIL_PASS in .env"
  );
  return false;
}

module.exports = { sendContactNotification, RECEIVING_EMAIL };
