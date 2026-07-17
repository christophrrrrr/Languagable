import { redirect } from "next/navigation";

// The cards area moved to /tarjetas (folder hub). Keep old links working.
export default function ProgressPage() {
  redirect("/tarjetas");
}
