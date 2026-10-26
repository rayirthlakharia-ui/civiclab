"use client";
import { useState } from "react";
import meetings from "@/data/teen-meetings.json";
export type TeenTopic = {
  title: string;
  date: string;
  item: string;
  agendaUrl: string;
};
export function TeenMeetings({
  onChoose,
}: {
  onChoose: (topic: TeenTopic) => void;
}) {
  const [selected, setSelected] = useState(meetings[0].id);
  const meeting = meetings.find((m) => m.id === selected)!;
  const agendaUrl = `https://sanramonca.api.civicclerk.com/v1/Meetings/GetMeetingFileStream(fileId=${meeting.agendaFileId},plainText=false)`;
  return (
    <section className="teen-meetings" aria-labelledby="teen-meetings-title">
      <p className="eyebrow">SAN RAMON · TEEN COUNCIL</p>
      <h2 id="teen-meetings-title">
        Real meetings. Issues that matter to teens.
      </h2>
      <p>
        The two most recent published Teen Council meetings found as of October
        24, 2026. Saved demo snapshots; both meetings are in the past.
      </p>
      <div
        className="teen-date-picker"
        aria-label="Choose a Teen Council meeting"
      >
        {meetings.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={m.id === selected}
            onClick={() => setSelected(m.id)}
          >
            {m.date}
          </button>
        ))}
      </div>
      <h3>
        {meeting.date} <span className="badge neutral">Past meeting</span>
      </h3>
      <p>
        6:30 p.m. · City Hall Training Room, 1st Floor · 7000 Bollinger Canyon
        Road
      </p>
      <p>
        Selected agenda topics below describe planned business, not confirmed
        decisions. Read the full agenda for all items.
      </p>
      <div className="teen-topic-grid">
        {meeting.topics.map((t) => (
          <article key={t.item}>
            <span className="eyebrow">ITEM {t.item}</span>
            <h4>{t.title}</h4>
            <p>{t.summary}</p>
            <button
              className="text-link"
              onClick={() =>
                onChoose({
                  title: t.title,
                  item: t.item,
                  date: meeting.date,
                  agendaUrl,
                })
              }
            >
              Write about this topic →
            </button>
          </article>
        ))}
      </div>
      <div className="teen-source-links">
        <a
          className="text-link"
          href={agendaUrl}
          target="_blank"
          rel="noreferrer"
        >
          Read official agenda (PDF, new tab) ↗
        </a>
        <a
          className="text-link"
          href={`https://sanramonca.portal.civicclerk.com/event/${meeting.id}/files`}
          target="_blank"
          rel="noreferrer"
        >
          Meeting files (new tab) ↗
        </a>
      </div>
      <p className="composer-note">
        These agendas direct written comments to the City Clerk for the Teen
        Council and explain that comments are posted publicly. Their pre-meeting
        deadlines have passed. You can prepare a follow-up about an issue; check
        current procedures before submitting a future meeting comment.
      </p>
    </section>
  );
}
