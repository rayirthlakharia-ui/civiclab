# CivicLab

A local educational prototype for the Congressional App Challenge. Explore constitutional rights, Dublin and San Ramon government, and two real federal bills in plain language.

## Run locally

Use Node.js 22 or newer and npm. Dependencies are already installed in this workspace. On a fresh checkout:

```bash
npm ci
```

Start the app:

```bash
npm run dev
```

Open **http://127.0.0.1:3000**. Stop the server with **Ctrl+C**. No environment file, account, database, or API key is required. Installation requires internet access; normal app interactions use bundled content. External citations require internet access.

For a production build:

```bash
npm run build
npm start
```

## What works

- Responsive homepage, active navigation, source directory, and a custom not-found page.
- Three rights topics: speech, searches, and due process/equal protection. Each includes a hypothetical, important limits, authoritative links, and a multiple-choice question with feedback.
- Quiz completion is tracked while the rights page remains open. Refreshing or leaving the page resets it. Changing topics resets the answer form, while the completion count remains.
- Dublin/San Ramon switching updates roles, meetings, participation guidance, and official links. City selection never requests location access.
- Two historical federal records: **S. 1409 (118th Congress)**, Kids Online Safety Act, and **S. 475 (117th Congress)**, Juneteenth National Independence Day Act.
- Simple and Detailed prepared explanations, glossaries, limitations, source versions, and clear distinctions between a historical proposal and an enacted law.
- Keyboard navigation, visible focus, skip link, labeled quiz controls, feedback announcements, and reduced-motion support.

## What is simulated or deferred

**Bill explanations are prepared offline demonstrations, not live AI-generated results.** Government records are curated snapshots, not live API responses. Changing the reading level selects a prepared explanation immediately. There is no simulated generation delay.

There are no Congress.gov, Open States, or OpenAI API calls in this prototype. Providing a key will not activate a hidden live mode. Live retrieval and Responses API integration with `gpt-6-luna` are later work, along with California bills, additional cities, and before/after assessment reporting.

No accounts, analytics, location collection, general chatbot, or persistent learning records are implemented. Next.js's own development tooling may have framework telemetry; this is separate from application analytics.

## Sources and content boundaries

Content was reviewed against available official sources on **October 23, 2026**. That date is a source-review date, not a claim that every upstream page was updated that day. Constitution Annotated blocked some automated page retrieval; indexed excerpts and the linked official T.L.O. material supported the lessons. This is a concise educational starting point, not personalized legal advice or a comprehensive legal review.

- Rights: [Constitution Annotated](https://constitution.congress.gov/), [National Archives amendment transcripts](https://www.archives.gov/founding-docs/bill-of-rights-transcript), and the [official T.L.O. case material](https://www.ojp.gov/pdffiles1/Digitization/138018NCJRS.pdf).
- Cities: official [Dublin](https://dublin.ca.gov/82/City-Council-Meetings) and [San Ramon](https://www.sanramon.ca.gov/how_do_i_/get_involved/official) websites. Regular meeting schedules can change; the app directs users to current official agendas.
- Bills: [S. 1409](https://www.congress.gov/bill/118th-congress/senate-bill/1409), using the CRS summary reported December 13, 2023; [S. 475](https://www.congress.gov/bill/117th-congress/senate-bill/475/text), using the law enacted June 17, 2021. S. 1409 is not conflated with related packages or later reintroductions.

Individual records and the `/sources` page contain the detailed citations. Reverify source records before presenting them as current information.

## Project structure

The interface uses a midnight-blue civic dashboard with translucent blue, violet, and teal cards, locally bundled DM Sans, a decorative Capitol illustration, and fixed bottom navigation on mobile. Dashboard cards and focus shortcuts open each feature. The Sources destination replaces an account profile because this prototype has no accounts. `src/app/design.css` holds the visual identity; `globals.css` supplies the shared component layouts. Fonts are served locally, so the redesign does not add external runtime requests.

```text
src/app/             Routes, shared layout, responsive styles
src/components/      Navigation, source lists, interactive feature components
src/data/            Rights, cities, bills, and prepared explanations (JSON)
src/lib/schemas.ts   Zod schemas and inferred TypeScript types
src/lib/content.ts   Validated local records and asynchronous bill provider
src/lib/format.ts    Consistent date formatting
tests/               Content integrity and browser interaction checks
```

Pages load normalized records and pass them to small interactive components. The bill provider is an explicit seam for a future server-only integration. Future live explanations must introduce a separate response type and visible provenance; they must not be labeled as prepared demos. Keep official metadata separate from model-written prose. Credentials belong only on the server, never in `NEXT_PUBLIC_*` variables.

Lesson/question IDs are stable so a later assessment can refer to the same learning objectives. More cities can use the existing city schema after scope approval.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Browser tests use Playwright with an installed **Google Chrome** (`channel: "chrome"`). If Chrome is unavailable, install it or install Playwright Chromium and remove the `channel` setting. Tests start or reuse the local development server.

The browser suite covers desktop, mobile, and tablet viewports; all pages; horizontal overflow; automated WCAG A/AA checks; quiz feedback/completion; city and bill switching; both reading levels; keyboard navigation; and absence of external requests on the bill page. Screenshots are saved under ignored `test-results/` directories. Automated checks do not establish complete accessibility compliance or legal accuracy.

Format source files with `npm run format`.

## A quick demonstration

1. Start from the homepage and select **Know your rights**.
2. Try an incorrect answer, read the feedback, then complete the three questions.
3. Switch between Dublin and San Ramon and inspect the different meeting information.
4. Open **Bill simplifier**, toggle Simple/Detailed, then compare the proposal with the enacted law.
5. Open **Our sources** to explain the content provenance and offline-demo boundary.

This prototype demonstrates the interface and learning flow. It does not yet demonstrate live AI or API integration, and learning impact would require a later user study.

### Council messages and meeting subjects

The local explorer links to official agenda portals and shows dated verification status. On October 24, 2026, Dublin's calendar listed November 3 at 5:30 p.m. with no agenda available; San Ramon's agenda content could not be verified automatically. The app does not invent agenda subjects or provide a live agenda feed. Official .gov pages link to the Legistar and CivicClerk hosts included in the source allowlist.

The opinion composer uses the writer's own text, previews the message, and provides a mailto draft or clipboard copy. Council email addresses were checked on the official city pages on October 24, 2026. Nothing is sent by CivicLab; drafts are held only in component state and cleared on city switches or reload. General council email is not represented as formal meeting-comment submission.

### Teen Council demo snapshots

San Ramon's explorer features October 20 and September 15, 2026 Teen Council agendas, the two most recent published meetings returned by CivicClerk on October 24, 2026. Source discovery: public `https://sanramonca.api.civicclerk.com/v1/Events` filtered by categoryName `Teen Council`, ordered by eventDate descending. Events 2491 and 2469; official agenda file IDs 3747 and 3664. Agenda text was verified using the public GetMeetingFileStream endpoint with plainText=true. Topics are paraphrases of planned business, not claims about outcomes. Snapshots do not auto-refresh.

Selecting a topic prepares a follow-up addressed to cityclerk@sanramon.ca.gov for the Teen Council, as identified in both agendas. Past deadlines are explicitly labeled; nothing is sent automatically. Choosing a new topic clears the previous draft. The general City Council composer remains available before a Teen Council topic is chosen.

### Representative portraits

Both city directories include five elected representatives, verified October 24, 2026 against their official council pages. San Ramon cards link to individual biographies; Dublin cards link to the city's council directory. Portraits are downloaded from those official pages and served locally through Next Image. Original photo URLs, profile URLs, and verification dates are recorded in `src/data/representatives.json`. The directory is a dated snapshot, not a live roster. `scripts/download-representatives.py` reproduces the original snapshot; review current membership and roles before updating it.
