import { z } from "zod";

const source = z.object({
  title: z.string().min(1),
  url: z.url().refine((url) => url.startsWith("https://")),
});
const sourced = { sources: z.array(source).min(1), reviewedAt: z.iso.date() };
export const lessonSchema = z.object({
  id: z.string(),
  amendment: z.string(),
  title: z.string(),
  shortTitle: z.string(),
  intro: z.string(),
  explanation: z.string(),
  scenario: z.string(),
  takeaway: z.string(),
  limitations: z.array(z.string()).min(1),
  question: z
    .object({
      id: z.string(),
      prompt: z.string(),
      options: z.array(z.string()).min(2),
      answer: z.number().int().nonnegative(),
      feedback: z.string(),
    })
    .refine(
      (q) => q.answer < q.options.length,
      "Answer must refer to an option",
    ),
  ...sourced,
});
export const citySchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  description: z.string(),
  government: z.string(),
  roles: z.array(z.object({ title: z.string(), description: z.string() })),
  responsibilities: z.array(z.string()),
  meeting: z.object({
    agendaUrl: z.url(),
    agendaStatus: z.string(),
    checkedAt: z.iso.date(),
    schedule: z.string(),
    time: z.string(),
    location: z.string(),
    url: z.url(),
  }),
  participation: z.array(z.string()),
  councilUrl: z.url(),
  councilEmail: z.email(),
  ...sourced,
});
export const billSchema = z.object({
  id: z.string(),
  number: z.string(),
  congress: z.number().int(),
  session: z.string(),
  jurisdiction: z.string(),
  title: z.string(),
  category: z.string(),
  sponsor: z.string(),
  status: z.enum(["enacted", "not-enacted"]),
  statusLabel: z.string(),
  officialStatus: z.string(),
  latestAction: z.string(),
  latestActionDate: z.iso.date(),
  sourceVersion: z.string(),
  scopeNote: z.string(),
  ...sourced,
});
const explanation = z.object({
  summary: z.string(),
  points: z.array(z.string()).min(1),
  terms: z.array(z.object({ term: z.string(), definition: z.string() })),
  limitation: z.string(),
});
export const demoSchema = z.object({
  billId: z.string(),
  mode: z.literal("offline-demo"),
  simple: explanation,
  detailed: explanation,
});
export type Source = z.infer<typeof source>;
export type Lesson = z.infer<typeof lessonSchema>;
export type City = z.infer<typeof citySchema>;
export type Bill = z.infer<typeof billSchema>;
export type Demo = z.infer<typeof demoSchema>;
export type Level = "simple" | "detailed";
