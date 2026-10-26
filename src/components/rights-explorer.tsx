"use client";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CircleHelp,
  Scale,
  Shield,
  MessageCircle,
  RotateCcw,
  Lightbulb,
  Heart,
  FilePenLine,
  Gavel,
} from "lucide-react";
import type { Lesson } from "@/lib/schemas";
import { SourceList } from "./shared";

const icons: Record<string, typeof Shield> = {
  speech: MessageCircle,
  searches: Shield,
  "due-process": Scale,
  religion: Heart,
  petition: FilePenLine,
  counsel: Gavel,
};
function Quiz({
  lesson,
  onComplete,
}: {
  lesson: Lesson;
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = selected === lesson.question.answer;
  return (
    <section className="quiz-panel">
      <p className="eyebrow">
        <CircleHelp size={15} /> PUT IT INTO PRACTICE
      </p>
      <h3>{lesson.question.prompt}</h3>
      <fieldset disabled={submitted}>
        <legend className="sr-only">Choose your answer</legend>
        {lesson.question.options.map((option, index) => (
          <label
            key={option}
            className={`quiz-option ${selected === index ? "selected" : ""} ${submitted && index === lesson.question.answer ? "correct" : ""}`}
          >
            <input
              type="radio"
              name={lesson.question.id}
              value={index}
              checked={selected === index}
              onChange={() => setSelected(index)}
            />
            <span>{option}</span>
            {submitted && index === lesson.question.answer && (
              <Check size={18} />
            )}
          </label>
        ))}
      </fieldset>
      <div aria-live="polite">
        {submitted && (
          <div className={`quiz-feedback ${correct ? "success" : "retry"}`}>
            <strong>
              {correct ? "That’s right." : "Let’s take another look."}
            </strong>
            <p>{lesson.question.feedback}</p>
          </div>
        )}
      </div>
      {!submitted ? (
        <button
          className="button primary small"
          disabled={selected === null}
          onClick={() => {
            setSubmitted(true);
            if (correct) onComplete();
          }}
        >
          Check my answer <ArrowRight size={16} />
        </button>
      ) : (
        <button
          className="text-link"
          onClick={() => {
            setSubmitted(false);
            setSelected(null);
          }}
        >
          <RotateCcw size={15} /> Try again
        </button>
      )}
    </section>
  );
}
export function RightsExplorer({ lessons }: { lessons: Lesson[] }) {
  const [active, setActive] = useState(lessons[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const lesson = lessons.find((item) => item.id === active)!;
  return (
    <div className="lesson-layout">
      <aside className="lesson-sidebar">
        <p className="sidebar-label">PICK A TOPIC</p>
        <div className="topic-list">
          {lessons.map((item) => {
            const Icon = icons[item.id] ?? Shield;
            return (
              <button
                key={item.id}
                aria-pressed={active === item.id}
                onClick={() => setActive(item.id)}
                className={`topic-button ${active === item.id ? "active" : ""}`}
              >
                <span className="topic-icon">
                  <Icon size={21} />
                </span>
                <span>
                  <small>{item.amendment}</small>
                  <strong>{item.shortTitle}</strong>
                </span>
                {completed.includes(item.id) ? (
                  <Check size={17} aria-label="Completed" />
                ) : (
                  <ArrowRight size={16} />
                )}
              </button>
            );
          })}
        </div>
        <div className="learning-progress">
          <span>
            {completed.length} of {lessons.length} knowledge checks completed
          </span>
          <progress
            max={lessons.length}
            value={completed.length}
            aria-label="Knowledge checks completed"
          />
          <small>Progress lasts while you’re on this page.</small>
        </div>
        <p className="educational-note">
          <Shield size={17} />
          For learning, not legal advice. These short examples cannot resolve an
          individual legal situation.
        </p>
      </aside>
      <article className="lesson-content" aria-labelledby="lesson-title">
        <div className="lesson-heading">
          <span className="badge neutral">{lesson.amendment}</span>
          <span className="read-time">A 3-minute starting point</span>
        </div>
        <h2 id="lesson-title">{lesson.title}</h2>
        <p className="lesson-intro">{lesson.intro}</p>
        <p>{lesson.explanation}</p>
        <div className="scenario">
          <p className="eyebrow">
            <Lightbulb size={16} /> IMAGINE THIS
          </p>
          <p className="scenario-text">{lesson.scenario}</p>
          <div className="takeaway">
            <strong>The takeaway</strong>
            <p>{lesson.takeaway}</p>
          </div>
        </div>
        <section className="limits">
          <h3>The details matter</h3>
          <ul>
            {lesson.limitations.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </section>
        <Quiz
          key={lesson.id}
          lesson={lesson}
          onComplete={() =>
            setCompleted((current) =>
              current.includes(lesson.id) ? current : [...current, lesson.id],
            )
          }
        />
        <SourceList sources={lesson.sources} reviewedAt={lesson.reviewedAt} />
      </article>
    </div>
  );
}
