import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy URL — practice uses the same questions without a separate “bank” entry point. */
export default async function QuizRedirectPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const params = new URLSearchParams({
    session: "study",
    count: String(sp.count ?? "20"),
  });

  const domain = sp.domain;
  const difficulty = sp.difficulty;
  const weakOnly = sp.weakOnly;

  if (typeof domain === "string" && domain) params.set("domain", domain);
  if (typeof difficulty === "string" && difficulty) {
    params.set("difficulty", difficulty);
  }
  if (weakOnly === "1" || weakOnly === "true") params.set("weakOnly", "1");

  redirect(`/practice?${params.toString()}`);
}
