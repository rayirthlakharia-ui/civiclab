"use client";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Info,
  LibraryBig,
} from "lucide-react";
import type { Bill, Demo, Level } from "@/lib/schemas";
import { formatDate } from "@/lib/format";
import { CheckBullet, SourceList } from "./shared";

export function BillExplorer({
  bills,
  demos,
}: {
  bills: Bill[];
  demos: Demo[];
}) {
  const [active, setActive] = useState(bills[0].id);
  const [level, setLevel] = useState<Level>("simple");
  const bill = bills.find((item) => item.id === active)!;
  const explanation = demos.find((demo) => demo.billId === bill.id)?.[level];
  return (
    <>
      <div className="demo-notice">
        <Info size={20} />
        <div>
          <strong>Offline demonstration</strong>
          <p>
            Prepared explanations using verified source material. No live AI
            generation or live legislative updates.
          </p>
        </div>
        <span className="badge neutral">NO API KEYS NEEDED</span>
      </div>
      <div className="bill-layout">
        <aside className="bill-sidebar">
          <p className="sidebar-label">EXPLORE THE SAMPLE COLLECTION</p>
          {bills.map((item) => (
            <button
              key={item.id}
              className={`bill-choice ${active === item.id ? "active" : ""}`}
              aria-pressed={active === item.id}
              onClick={() => setActive(item.id)}
            >
              <span className="bill-choice-top">
                <FileText size={19} />
                <small>
                  {item.number} · {item.congress}th Congress
                </small>
              </span>
              <strong>{item.title}</strong>
              <span
                className={`badge ${item.status === "enacted" ? "green" : "amber"}`}
              >
                {item.status === "enacted"
                  ? "Enacted law"
                  : "Historical proposal"}
              </span>
              <ArrowRight className="bill-choice-arrow" size={17} />
            </button>
          ))}
          <div className="bill-tip">
            <LibraryBig size={22} />
            <h3>A bill isn’t always a law.</h3>
            <p>
              These historical examples let you compare a proposal with
              legislation that became law. Always check the Congress and
              version.
            </p>
          </div>
        </aside>
        <article className="bill-detail" aria-labelledby="bill-title">
          <div className="bill-heading">
            <p className="eyebrow">
              {bill.number} / {bill.congress}TH CONGRESS ({bill.session})
            </p>
            <span
              className={`badge ${bill.status === "enacted" ? "green" : "amber"}`}
            >
              {bill.statusLabel}
            </span>
          </div>
          <h2 id="bill-title">{bill.title}</h2>
          <p className="bill-category">{bill.category}</p>
          <dl className="bill-metadata">
            <div>
              <dt>Sponsor</dt>
              <dd>{bill.sponsor}</dd>
            </div>
            <div>
              <dt>Congress.gov status</dt>
              <dd>{bill.officialStatus}</dd>
            </div>
            <div className="latest-action">
              <dt>
                Latest action in this record ·{" "}
                {formatDate(bill.latestActionDate)}
              </dt>
              <dd>{bill.latestAction}</dd>
            </div>
          </dl>
          <div className="explanation-heading">
            <h3>
              <BookOpen size={20} /> In clearer language
            </h3>
            <div className="segmented compact" aria-label="Explanation level">
              <button
                aria-pressed={level === "simple"}
                onClick={() => setLevel("simple")}
              >
                Simple
              </button>
              <button
                aria-pressed={level === "detailed"}
                onClick={() => setLevel("detailed")}
              >
                Detailed
              </button>
            </div>
          </div>
          <div className="explanation-panel" aria-live="polite">
            {explanation ? (
              <>
                <p className="eyebrow">
                  {level === "simple" ? "THE SHORT VERSION" : "A CLOSER LOOK"} ·
                  PREPARED DEMO
                </p>
                <p className="explanation-summary">{explanation.summary}</p>
                <ul className="explanation-points">
                  {explanation.points.map((point) => (
                    <CheckBullet key={point}>{point}</CheckBullet>
                  ))}
                </ul>
                <div className="glossary">
                  <h4>Words worth knowing</h4>
                  <dl>
                    {explanation.terms.map((term) => (
                      <div key={term.term}>
                        <dt>{term.term}</dt>
                        <dd>{term.definition}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <p className="explanation-limit">
                  <Info size={16} />
                  {explanation.limitation}
                </p>
              </>
            ) : (
              <div className="empty-state">
                <Info size={24} />
                <h3>Not enough source information</h3>
                <p>
                  No prepared explanation is available for this selection. Read
                  the official source below.
                </p>
              </div>
            )}
          </div>
          <p className="version-note">
            <CheckCircle2 size={16} />
            <span>
              <strong>Explanation source:</strong> {bill.sourceVersion}
              <br />
              {bill.scopeNote}
            </span>
          </p>
          <a
            className="text-link"
            href={bill.sources[0].url}
            target="_blank"
            rel="noreferrer"
          >
            Read the official record <ArrowUpRight size={16} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <SourceList sources={bill.sources} reviewedAt={bill.reviewedAt} />
        </article>
      </div>
    </>
  );
}
