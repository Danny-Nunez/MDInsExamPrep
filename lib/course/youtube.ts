/** YouTube embed URL with captions on by default. */
export function youtubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    cc_load_policy: "1",
    cc_lang_pref: "en",
    rel: "0",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
