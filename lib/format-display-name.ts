/** Capitalize the first letter; lowercase the rest of the word. */
export function capitalizeWord(word: string): string {
  const w = word.trim();
  if (!w) return "";
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}

/** Insert spaces before capital letters in camelCase / PascalCase. */
function splitCamelCase(value: string): string {
  return value
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim();
}

/** e.g. julie.nunez@example.com → "Julie Nunez" */
export function formatNameFromEmail(email?: string | null): string | null {
  const local = email?.split("@")[0]?.trim();
  if (!local) return null;

  const parts = local
    .split(/[._+-]+/)
    .map((p) => p.replace(/\d+/g, ""))
    .filter((p) => p.length >= 2);

  if (parts.length < 2) return null;
  return parts.map(capitalizeWord).join(" ");
}

/**
 * Format a full name for display: spaces between parts, title case each word.
 */
export function formatDisplayName(
  name?: string | null,
  email?: string | null
): string | null {
  const trimmed = name?.trim();
  if (!trimmed) {
    return formatNameFromEmail(email);
  }

  let spaced = trimmed.includes(" ")
    ? trimmed.replace(/\s+/g, " ")
    : splitCamelCase(trimmed);

  if (!spaced.includes(" ")) {
    const fromEmail = formatNameFromEmail(email);
    if (fromEmail) {
      spaced = fromEmail;
    }
  }

  const words = spaced.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  return words.map(capitalizeWord).join(" ");
}

/** Normalize user-entered name for storage (no email inference). */
export function normalizeFullName(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  const spaced = trimmed.includes(" ") ? trimmed : splitCamelCase(trimmed);
  const words = spaced.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  return words.map(capitalizeWord).join(" ");
}

/** First name only, formatted — for shorter greetings if needed. */
export function formatGreetingFirstName(
  name?: string | null,
  email?: string | null
): string | null {
  const full = formatDisplayName(name, email);
  if (!full) return null;
  return full.split(/\s+/)[0] ?? full;
}
