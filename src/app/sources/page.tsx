import type { Metadata } from "next";
import { BookOpen, ShieldCheck, FileCheck2 } from "lucide-react";
import { PageIntro, SourceList } from "@/components/shared";
import { lessons, cities, localBillProvider } from "@/lib/content";
export const metadata: Metadata = { title: "Sources & approach" };
export default async function SourcesPage() {
  const bills = await localBillProvider.listBills();
  return (
    <div className="container inner-page">
      <PageIntro
        eyebrow="SOURCES & APPROACH"
        title="Understanding starts"
        accent="with good sources."
        description="CivicLab is an independent educational prototype. Here’s where the information comes from and what this version can—and cannot—do."
      />
      <div className="principle-grid">
        <article>
          <BookOpen />
          <h2>Read the original.</h2>
          <p>
            Rights lessons draw on Constitution Annotated and original amendment
            text. City information comes from official municipal websites. Bill
            examples link to Congress.gov.
          </p>
        </article>
        <article>
          <FileCheck2 />
          <h2>Know the version.</h2>
          <p>
            Records are manually curated snapshots reviewed on October 23, 2026.
            Bill explanations name their source version. City schedules need
            checking against the latest official agenda.
          </p>
        </article>
        <article>
          <ShieldCheck />
          <h2>Keep the limits clear.</h2>
          <p>
            Explanations are prepared demonstrations, not live AI output. This
            is educational information, not personalized legal advice. No
            accounts, analytics, or location access are used.
          </p>
        </article>
      </div>
      <div className="sources-index">
        <h2>Follow the evidence.</h2>
        <p>
          External links open in a new tab and need an internet connection. The
          core prototype works from bundled local content.
        </p>
        <div className="sources-grid">
          {[
            ...lessons.map((lesson) => ({
              ...lesson,
              label: lesson.shortTitle,
            })),
            ...cities.map((city) => ({ ...city, label: city.name })),
            ...bills.map((bill) => ({
              ...bill,
              label: `${bill.number} · ${bill.title}`,
            })),
          ].map((record) => (
            <section key={record.id}>
              <h3>{record.label}</h3>
              <SourceList
                sources={record.sources}
                reviewedAt={record.reviewedAt}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
