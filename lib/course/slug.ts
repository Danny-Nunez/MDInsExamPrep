export function lessonSlug(title: string): string {
  return title
    .replace(/^✅\s*/, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
