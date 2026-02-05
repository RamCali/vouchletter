import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the Command Center (Letters dashboard)
  redirect("/letters");
}
