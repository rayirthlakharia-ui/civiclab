import type { Metadata } from "next";
import { PageIntro } from "@/components/shared";
import { RightsExplorer } from "@/components/rights-explorer";
import { lessons } from "@/lib/content";
export const metadata: Metadata = { title: "Know your rights" };
export default function RightsPage() {
  return (
    <div className="container inner-page">
      <PageIntro
        eyebrow="01 / KNOW YOUR RIGHTS"
        title="Big ideas."
        accent="Everyday rights."
        description="Get to know the constitutional protections behind real-life questions. Pick a topic, explore a scenario, and check your understanding."
      />
      <RightsExplorer lessons={lessons} />
    </div>
  );
}
