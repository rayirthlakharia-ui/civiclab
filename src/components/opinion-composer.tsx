"use client";
import { useState } from "react";
import { Mail, Copy, MessageSquare } from "lucide-react";
import type { City } from "@/lib/schemas";

import type { TeenTopic } from "./teen-meetings";
export function OpinionComposer({
  city,
  teenTopic,
}: {
  city: City;
  teenTopic?: TeenTopic;
}) {
  const recipient = teenTopic ? "cityclerk@sanramon.ca.gov" : city.councilEmail;
  const council = teenTopic
    ? "San Ramon Teen Council (via City Clerk)"
    : `${city.name} City Council`;
  const [topic, setTopic] = useState(
    teenTopic ? `Item ${teenTopic.item}: ${teenTopic.title}` : "",
  );
  const [opinion, setOpinion] = useState("");
  const [request, setRequest] = useState("");
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState("");
  const subject = teenTopic
    ? `Follow-up: Teen Council ${teenTopic.date} — ${topic.trim()}`
    : `Community input: ${topic.trim()}`;
  const message = `Dear ${council},\n\nI am writing about ${topic.trim()}.\n\n${opinion.trim()}\n\nI would like the council to consider: ${request.trim()}\n\nThank you for considering my perspective.${name.trim() ? `\n\n${name.trim()}` : ""}`;
  const ready = !!(topic.trim() && opinion.trim() && request.trim());
  async function copy() {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${message}`);
      setStatus(
        "Copied. Paste it into your email or the city’s contact form. Nothing has been sent.",
      );
    } catch {
      setStatus(
        "Copy was unavailable. Select and copy the preview text below instead.",
      );
    }
  }
  return (
    <section className="opinion-composer" aria-labelledby="opinion-title">
      <p className="eyebrow">
        <MessageSquare size={16} /> YOUR PERSPECTIVE MATTERS
      </p>
      <h2 id="opinion-title">Turn your opinion into a message.</h2>
      <p>
        Write to {council} in your own words. Choose an agenda item or a local
        issue you care about.
      </p>
      {teenTopic && (
        <p className="composer-note">
          Follow-up on the {teenTopic.date} meeting. Its comment deadline has
          passed. This message is not an on-time comment for that past meeting.
          Choosing another topic clears this draft.
        </p>
      )}
      <p className="composer-note">
        Your draft stays on this page until you copy it or open your email app.
        Switching cities or refreshing clears it. Avoid private details such as
        your home address or school schedule. Messages you send to the city may
        become public.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (ready) {
            setPreview(true);
            setStatus("");
          }
        }}
        onChange={() => {
          setPreview(false);
          setStatus("");
        }}
      >
        <label htmlFor="opinion-topic">What issue matters to you?</label>
        <input
          id="opinion-topic"
          required
          maxLength={120}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Issue or agenda item title and number"
        />
        <label htmlFor="opinion-body">What is your opinion, and why?</label>
        <textarea
          id="opinion-body"
          required
          maxLength={1200}
          rows={5}
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          placeholder="Explain what you think and how the issue affects you or your community."
        />
        <label htmlFor="opinion-request">
          What would you like the council to do?
        </label>
        <textarea
          id="opinion-request"
          required
          maxLength={400}
          rows={3}
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Suggest a specific action or ask a question."
        />
        <label htmlFor="opinion-name">Sign-off name (optional)</label>
        <input
          id="opinion-name"
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        <button className="button primary" type="submit" disabled={!ready}>
          Preview my message
        </button>
      </form>
      {preview && (
        <section className="opinion-preview" aria-label="Message preview">
          <h3>Review before sharing</h3>
          <p>To: {recipient}</p>
          <p>
            <strong>Subject: {subject}</strong>
          </p>
          <pre>{message}</pre>
          <div className="composer-actions">
            <a
              className="button primary"
              href={`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
            >
              <Mail size={16} /> Open email draft
            </a>
            <button className="button" type="button" onClick={copy}>
              <Copy size={16} /> Copy message
            </button>
          </div>
          <p className="composer-note">
            Opening a draft does not send it. Review the recipient and text in
            your email app, then send when ready. For formal meeting comments,
            check the agenda’s submission method and deadline; a general council
            email may not count as a meeting comment.
          </p>
          <a
            href={teenTopic?.agendaUrl ?? city.councilUrl}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            {teenTopic
              ? "Official agenda and comment instructions"
              : "Official council contact page"}{" "}
            (opens in a new tab)
          </a>
        </section>
      )}
      <p role="status">{status}</p>
    </section>
  );
}
