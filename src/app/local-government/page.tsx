import type { Metadata } from "next";
import { PageIntro } from "@/components/shared";
import { CityExplorer } from "@/components/city-explorer";
import { cities } from "@/lib/content";
export const metadata: Metadata = { title: "Local government" };
export default function LocalPage() {
  return (
    <div className="container inner-page">
      <PageIntro
        eyebrow="02 / LOCAL GOVERNMENT"
        title="Big change"
        accent="starts local."
        description="Your community is a good place to begin. Discover how your city works, what it does, and how you can join the conversation."
      />
      <CityExplorer cities={cities} />
    </div>
  );
}
