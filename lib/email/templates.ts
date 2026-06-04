import { APP_NAME, SITE_URL } from "@/lib/branding";

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;border:1px solid #e7e5e4;overflow:hidden;">
        <tr><td style="background:#1a1a1a;padding:20px 24px;">
          <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">${APP_NAME}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#a8a29e;">Maryland Life &amp; Health exam prep</p>
        </td></tr>
        <tr><td style="padding:28px 24px;color:#1c1917;font-size:15px;line-height:1.6;">
          ${content}
        </td></tr>
        <tr><td style="padding:16px 24px 24px;border-top:1px solid #f5f5f4;">
          <p style="margin:0;font-size:12px;color:#78716c;line-height:1.5;">
            Questions? Reply to this email or visit
            <a href="${SITE_URL}" style="color:#c8102e;">${SITE_URL.replace(/^https?:\/\//, "")}</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0 0;">
    <a href="${href}" style="display:inline-block;background:#c8102e;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:8px;">${label}</a>
  </p>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#78716c;font-size:13px;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600;">${value}</td>
  </tr>`;
}

export function welcomeEmailHtml(params: {
  name: string;
  dashboardUrl: string;
  subscribeUrl: string;
}): string {
  return layout(`
    <h1 style="margin:0 0 12px;font-size:22px;color:#1c1917;">Welcome, ${params.name}!</h1>
    <p style="margin:0 0 16px;">Your account is ready. You&apos;re one step away from full Maryland Life &amp; Health exam prep:</p>
    <ul style="margin:0 0 16px;padding-left:20px;color:#44403c;">
      <li>Unlimited practice exams &amp; Prometric-style simulations</li>
      <li>AI quizzes on your weak areas</li>
      <li>Performance tracking and study plan insights</li>
    </ul>
    <p style="margin:0;">Activate your subscription to unlock the dashboard and start studying.</p>
    ${button(params.subscribeUrl, "Continue to checkout")}
    <p style="margin:16px 0 0;font-size:13px;color:#78716c;">
      Already subscribed? <a href="${params.dashboardUrl}" style="color:#c8102e;">Go to your dashboard</a>
    </p>
  `);
}

export function welcomeEmailText(params: {
  name: string;
  dashboardUrl: string;
  subscribeUrl: string;
}): string {
  return `Welcome, ${params.name}!

Your ${APP_NAME} account is ready.

Unlock full access with:
- Unlimited practice exams & Prometric-style simulations
- AI quizzes on your weak areas
- Performance tracking and study plan insights

Continue to checkout: ${params.subscribeUrl}

Already subscribed? Dashboard: ${params.dashboardUrl}
`;
}

export function passwordResetEmailHtml(params: {
  name: string;
  resetUrl: string;
}): string {
  return layout(`
    <h1 style="margin:0 0 12px;font-size:22px;color:#1c1917;">Reset your password</h1>
    <p style="margin:0 0 16px;">Hi ${params.name}, we received a request to reset the password for your account. This link expires in 1 hour.</p>
    ${button(params.resetUrl, "Reset password")}
    <p style="margin:20px 0 0;font-size:13px;color:#78716c;">If you didn&apos;t request this, you can safely ignore this email.</p>
  `);
}

export function passwordResetEmailText(params: {
  name: string;
  resetUrl: string;
}): string {
  return `Hi ${params.name},

Reset your ${APP_NAME} password (link expires in 1 hour):

${params.resetUrl}

If you didn't request this, ignore this email.
`;
}

export function subscriptionActiveEmailHtml(params: {
  name: string;
  planName: string;
  priceLabel: string;
  nextBillDate: string;
  dashboardUrl: string;
}): string {
  return layout(`
    <h1 style="margin:0 0 12px;font-size:22px;color:#1c1917;">You&apos;re all set!</h1>
    <p style="margin:0 0 20px;">Hi ${params.name}, thank you for subscribing. Your payment was successful and full exam prep is now active.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border-radius:8px;padding:4px 16px;margin:0 0 20px;">
      ${detailRow("Plan", params.planName)}
      ${detailRow("Price", params.priceLabel)}
      ${detailRow("Next billing date", params.nextBillDate)}
      ${detailRow("Status", "Active")}
    </table>
    <p style="margin:0;">Start with a practice exam or let AI build a quiz from your weak topics.</p>
    ${button(params.dashboardUrl, "Open your dashboard")}
  `);
}

export function subscriptionActiveEmailText(params: {
  name: string;
  planName: string;
  priceLabel: string;
  nextBillDate: string;
  dashboardUrl: string;
}): string {
  return `Hi ${params.name},

Your ${APP_NAME} subscription is active.

Plan: ${params.planName}
Price: ${params.priceLabel}
Next billing date: ${params.nextBillDate}
Status: Active

Open your dashboard: ${params.dashboardUrl}
`;
}
