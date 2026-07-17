import { redirect } from "next/navigation";

// The cards area moved under /[lang]/tarjetas. Old links land on the
// language picker.
export default function ProgressPage() {
  redirect("/");
}
