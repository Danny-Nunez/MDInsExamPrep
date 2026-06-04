type SendEmailParams = {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  text: string;
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
      console.error("mailersend error:", res.status, errText);
      return {
        ok: false,
        error: `MailerSend returned ${res.status}`,
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
