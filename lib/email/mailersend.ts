type SendEmailParams = {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  text: string;
  replyTo?: { email: string; name?: string };
};

type MailerSendResponse = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

function getApiKey(): string | null {
  const key = process.env.MAILERSEND_API_KEY?.trim();
  return key || null;
}

export function getMailFrom(): { email: string; name: string } {
  const email =
    process.env.MAIL_FROM_EMAIL?.trim() || "noreply@marylandinsuranceexam.com";
  const name =
    process.env.MAIL_FROM_NAME?.trim() || "Maryland Insurance Exam";
  return { email, name };
}

/** Contact form delivery inbox. Override for MailerSend trial (limited recipients). */
export function getContactToEmail(): string {
  return (
    process.env.CONTACT_TO_EMAIL?.trim() || "support@marylandinsuranceexam.com"
  );
}

/** MailerSend trial limits unique recipients — reply-to counts as another one. */
export function contactFormUsesReplyTo(): boolean {
  return process.env.CONTACT_USE_REPLY_TO?.trim().toLowerCase() === "true";
}

export function isEmailConfigured(): boolean {
  return Boolean(getApiKey() && getMailFrom().email);
}

/** Send via MailerSend REST API. Fails softly when not configured (dev). */
export async function sendMailerSendEmail(
  params: SendEmailParams
): Promise<MailerSendResponse> {
  const apiKey = getApiKey();
  const from = getMailFrom();

  if (!apiKey) {
    console.warn("mailersend: MAILERSEND_API_KEY not set — email skipped");
    return { ok: false, skipped: true, error: "Email not configured" };
  }

  const body = {
    from: { email: from.email, name: from.name },
    to: [
      {
        email: params.to.email,
        ...(params.to.name ? { name: params.to.name } : {}),
      },
    ],
    subject: params.subject,
    html: params.html,
    text: params.text,
    ...(params.replyTo
      ? {
          reply_to: {
            email: params.replyTo.email,
            ...(params.replyTo.name ? { name: params.replyTo.name } : {}),
          },
        }
      : {}),
  };

  try {
    const res = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(
        "mailersend error:",
        res.status,
        errText,
        `(to: ${params.to.email}${params.replyTo ? `, reply-to: ${params.replyTo.email}` : ""})`
      );
      let error = `MailerSend returned ${res.status}`;
      try {
        const parsed = JSON.parse(errText) as { message?: string };
        if (parsed.message?.includes("MS42225")) {
          error =
            "MailerSend trial recipient limit — use a verified domain address for CONTACT_TO_EMAIL (e.g. info@marylandinsuranceexam.com).";
        } else if (parsed.message) {
          error = parsed.message;
        }
      } catch {
        // keep generic error
      }
      return {
        ok: false,
        error,
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("mailersend fetch error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Send failed",
    };
  }
}
