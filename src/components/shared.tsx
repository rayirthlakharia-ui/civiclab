import { ArrowUpRight, BookOpen, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Source } from "@/lib/schemas";
import { formatDate } from "@/lib/format";

export function SourceList({
  sources,
  reviewedAt,
}: {
  sources: Source[];
  reviewedAt: string;
}) {
  return (
    <section className="source-box" aria-label="Sources">
      <div className="source-title">
        <BookOpen size={17} />
        <h3>Go straight to the source</h3>
      </div>
      <ul>
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title}
              <ArrowUpRight size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="fine-print">
        Source review: {formatDate(reviewedAt)} · Curated content, not a live
        feed.
      </p>
    </section>
  );
}
export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h1>
        {title} <em>{accent}</em>
      </h1>
      <p className="intro-copy">{description}</p>
    </div>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Link href="/" className="footer-brand">
            CivicLab.
          </Link>
          <p>A little understanding. A lot more possibility.</p>
        </div>
        <div className="footer-right">
          <span>
            <ShieldCheck size={15} /> Learn with sources.
          </span>
          <Link href="/sources">
            Sources & approach <ArrowUpRight size={14} />
          </Link>
          <p>An independent educational project. Not a government website.</p>
        </div>
      </div>
    </footer>
  );
}
export function CheckBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="check-bullet">
      <Check size={17} />
      <span>{children}</span>
    </li>
  );
}
