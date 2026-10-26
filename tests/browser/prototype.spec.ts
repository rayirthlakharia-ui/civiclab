import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage links work and all main pages are accessible without overflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [path, heading] of [
    ["/", "Welcome, explorer."],
    ["/rights", "Big ideas."],
    ["/local-government", "Big change"],
    ["/bills", "Less legalese."],
    ["/sources", "Understanding starts"],
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      heading,
    );
    await expect(page.locator("body")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, `Horizontal overflow at ${path}`).toBe(false);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await page.screenshot({
      path: testInfo.outputPath(`${path === "/" ? "home" : path.slice(1)}.png`),
      fullPage: true,
    });
    expect
      .soft(
        results.violations.map((v) => ({
          rule: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            reason: n.failureSummary,
          })),
        })),
        `Accessibility issues at ${path}`,
      )
      .toEqual([]);
  }
  expect(errors).toEqual([]);
  await page.goto("/");
  await page.getByRole("link", { name: "Let’s explore", exact: true }).click();
  await expect(page).toHaveURL(/\/rights$/);
});

test("all quizzes give feedback, retain completion, and reset answers on topic changes", async ({
  page,
}) => {
  await page.goto("/rights");
  await expect(
    page.getByRole("button", { name: "Check my answer" }),
  ).toBeDisabled();
  await page
    .getByRole("radio", { name: "Yes, if most students disagree." })
    .check();
  await page.getByRole("button", { name: "Check my answer" }).click();
  await expect(page.getByText("Let’s take another look.")).toBeVisible();
  await expect(
    page.getByText("0 of 6 knowledge checks completed"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await page
    .getByRole("radio", { name: "No. Disagreement alone is not enough." })
    .check();
  await page.getByRole("button", { name: "Check my answer" }).click();
  await expect(page.getByText("That’s right.")).toBeVisible();
  await page.getByRole("button", { name: /Fourth Amendment/ }).click();
  await expect(
    page.getByRole("button", { name: "Check my answer" }),
  ).toBeDisabled();
  await page
    .getByRole("radio", {
      name: "The reason for the search and its scope both matter.",
    })
    .check();
  await page.getByRole("button", { name: "Check my answer" }).click();
  await page.getByRole("button", { name: /Fifth & Fourteenth/ }).click();
  await page
    .getByRole("radio", {
      name: "Appropriate procedures when government takes a protected interest.",
    })
    .check();
  await page.getByRole("button", { name: "Check my answer" }).click();
  await expect(
    page.getByText("3 of 6 knowledge checks completed"),
  ).toBeVisible();
  for (const [topic, answer] of [
    [
      "Freedom of religion",
      "A government rule targeting religious conduct for discriminatory treatment.",
    ],
    [
      "Petitioning government",
      "Writing to city officials asking them to fix a community problem.",
    ],
    [
      "Right to a lawyer",
      "No. Its counsel protection concerns criminal prosecutions, with specific rules.",
    ],
  ]) {
    await page.getByRole("button", { name: new RegExp(topic) }).click();
    await expect(
      page.getByRole("button", { name: "Check my answer" }),
    ).toBeDisabled();
    await page.getByRole("radio", { name: answer, exact: true }).check();
    await page.getByRole("button", { name: "Check my answer" }).click();
    await expect(page.getByText("That’s right.")).toBeVisible();
  }
  await expect(
    page.getByText("6 of 6 knowledge checks completed"),
  ).toBeVisible();
  await page.getByRole("button", { name: /Speech & expression/ }).click();
  await expect(
    page.getByRole("button", { name: "Check my answer" }),
  ).toBeDisabled();
});

test("city selection updates meetings, roles, and official links", async ({
  page,
}) => {
  await page.goto("/local-government");
  await expect(
    page.getByRole("heading", { name: "Hello, Dublin." }),
  ).toBeVisible();
  await expect(
    page.getByText("7:00 p.m. Pacific", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "San Ramon", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Hello, San Ramon." }),
  ).toBeVisible();
  await expect(
    page.getByText("6:30 p.m. Pacific", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /View official meeting info/ }),
  ).toHaveAttribute(
    "href",
    "https://www.sanramon.ca.gov/how_do_i_/get_involved/official",
  );
  await page.getByRole("button", { name: "Dublin", exact: true }).click();
  await expect(
    page.getByRole("link", { name: /View official meeting info/ }),
  ).toHaveAttribute("href", "https://dublin.ca.gov/82/City-Council-Meetings");
});

test("bill and level switching preserve source identity and clear offline labels", async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:3000"))
      externalRequests.push(request.url());
  });
  await page.goto("/bills");
  await expect(
    page.getByText("Offline demonstration", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Kids Online Safety Act", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Not enacted · historical proposal"),
  ).toBeVisible();
  await expect(
    page.getByText(
      "This proposal aimed to make certain online platforms safer for young people.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Detailed", exact: true }).click();
  await expect(
    page.getByText(
      "The reported proposal would require covered platforms to take reasonable measures against specified harms to minors.",
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Juneteenth National Independence Day Act/ })
    .click();
  await expect(page.getByText("Enacted · Public Law 117-17")).toBeVisible();
  await expect(
    page.getByText(
      "Public Law 117-17 amended 5 U.S.C. § 6103(a), the federal statute listing legal public holidays.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Simple", exact: true }).click();
  await expect(
    page.getByText(
      "This law made June 19 a federal holiday called Juneteenth National Independence Day.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Read the official record/ }),
  ).toHaveAttribute(
    "href",
    "https://www.congress.gov/bill/117th-congress/senate-bill/475",
  );
  expect(externalRequests).toEqual([]);
});

test("keyboard users can skip navigation and activate a feature", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Let’s explore", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/rights$/);
});

test("dashboard shortcuts and bottom navigation open the right features", async ({
  page,
}) => {
  await page.goto("/");
  const cards = page.getByRole("region", { name: "Explore CivicLab" });
  await expect(
    cards.getByRole("link", { name: /Know Your Rights/ }),
  ).toHaveAttribute("href", "/rights");
  await expect(
    cards.getByRole("link", { name: /Local Government Explorer/ }),
  ).toHaveAttribute("href", "/local-government");
  await expect(
    cards.getByRole("link", { name: /AI Bill Simplifier/ }),
  ).toContainText("Offline demo");
  await page.getByRole("link", { name: /Find your city/ }).click();
  await expect(page).toHaveURL(/\/local-government$/);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Bills", exact: true })
    .click();
  await expect(page).toHaveURL(/\/bills$/);
  await expect(
    page.getByText("Offline demonstration", { exact: true }),
  ).toBeVisible();
});

test("opinion drafts preserve the writer's words and use the selected council", async ({
  page,
}) => {
  await page.goto("/local-government");
  await expect(
    page.getByRole("link", { name: /Read meeting subjects/ }),
  ).toHaveAttribute("href", "https://dublin.legistar.com/Calendar.aspx");
  await expect(
    page.getByRole("button", { name: "Preview my message" }),
  ).toBeDisabled();
  await page.getByLabel("What issue matters to you?").fill("Parks & paths");
  await page
    .getByLabel("What is your opinion, and why?")
    .fill("I think our paths need more lighting.");
  await page
    .getByLabel("What would you like the council to do?")
    .fill("Please review lighting options.");
  await page.getByRole("button", { name: "Preview my message" }).click();
  const draft = page.getByRole("link", { name: "Open email draft" });
  const href = await draft.getAttribute("href");
  expect(href).toContain("mailto:council@dublin.ca.gov?");
  expect(decodeURIComponent(href!)).toContain(
    "I think our paths need more lighting.",
  );
  await page.getByLabel("What issue matters to you?").fill("Updated issue");
  await expect(draft).toHaveCount(0);
  await page.getByRole("button", { name: "San Ramon", exact: true }).click();
  await expect(page.getByLabel("What issue matters to you?")).toHaveValue("");
  await page.getByLabel("What issue matters to you?").fill("Parks");
  await page
    .getByLabel("What is your opinion, and why?")
    .fill("More shade would help.");
  await page
    .getByLabel("What would you like the council to do?")
    .fill("Consider trees.");
  await page.getByRole("button", { name: "Preview my message" }).click();
  await expect(draft).toHaveAttribute(
    "href",
    /^mailto:CityCouncil@sanramon.ca.gov\?/,
  );
});

test("Teen Council snapshots connect agenda topics to correctly addressed follow-ups", async ({
  page,
}) => {
  await page.goto("/local-government");
  await page.getByRole("button", { name: "San Ramon", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tri-Valley Teen Job Fair" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Write about this topic" })
    .first()
    .click();
  await expect(page.getByLabel("What issue matters to you?")).toHaveValue(
    "Item 3.2: Tri-Valley Teen Job Fair",
  );
  await page
    .getByLabel("What is your opinion, and why?")
    .fill("I would like more time to ask employers questions.");
  await page
    .getByLabel("What would you like the council to do?")
    .fill("Consider a question session.");
  await page.getByRole("button", { name: "Preview my message" }).click();
  const href = await page
    .getByRole("link", { name: "Open email draft" })
    .getAttribute("href");
  expect(href).toContain("mailto:cityclerk@sanramon.ca.gov?");
  expect(decodeURIComponent(href!)).toContain(
    "Follow-up: Teen Council October 20, 2026",
  );
  await page
    .getByRole("button", { name: "September 15, 2026", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Unity Day", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Write about this topic" })
    .nth(1)
    .click();
  await expect(page.getByLabel("What issue matters to you?")).toHaveValue(
    "Item 3.3: Unity Day",
  );
  await expect(page.getByLabel("What is your opinion, and why?")).toHaveValue(
    "",
  );
});

test("representative portraits and official links match the selected city", async ({
  page,
}) => {
  await page.goto("/local-government");
  for (const [city, mayor] of [
    ["Dublin", "Sherry Hu"],
    ["San Ramon", "Mark Armstrong"],
  ]) {
    await page.getByRole("button", { name: city, exact: true }).click();
    const section = page.getByRole("region", {
      name: "Meet your elected representatives.",
    });
    await expect(section.getByRole("link")).toHaveCount(5);
    await expect(
      section.getByRole("link", { name: new RegExp(mayor) }),
    ).toHaveAttribute("href", /https:\/\/www\.(dublin|sanramon)\.ca\.gov\//);
    for (const img of await section.getByRole("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    ).toBe(false);
  }
});
