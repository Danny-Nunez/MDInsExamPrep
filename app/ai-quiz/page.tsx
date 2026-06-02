import { redirect } from "next/navigation";

/** Legacy URL — focused practice lives on the Practice Exams hub. */
export default function AIQuizRedirectPage() {
  redirect("/practice#focused-practice");
}
