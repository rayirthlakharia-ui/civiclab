import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read = async (name) =>
  JSON.parse(
    await readFile(
      new URL(`../src/data/${name}.json`, import.meta.url),
      "utf8",
    ),
  );
const [rights, cities, bills, demos] = await Promise.all(
  ["rights", "cities", "bills", "demo-explanations"].map(read),
);
test("every record has unique identity, a review date and official source links", () => {
  const all = [...rights, ...cities, ...bills];
  assert.equal(new Set(all.map((record) => record.id)).size, all.length);
  for (const record of all) {
    assert.match(record.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(record.sources.length > 0);
    for (const source of record.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, "https:");
      // These exact agenda hosts are linked by the cities' official .gov pages.
      const officialAgendaHosts = [
        "dublin.legistar.com",
        "sanramonca.portal.civicclerk.com",
      ];
      assert.ok(
        url.hostname.endsWith(".gov") ||
          officialAgendaHosts.includes(url.hostname),
        source.url,
      );
      assert.ok(source.title.length > 0);
    }
  }
});
test("each lesson has a distinct question, valid answer, limitations and feedback", () => {
  assert.equal(rights.length, 6);
  assert.equal(new Set(rights.map((r) => r.question.id)).size, rights.length);
  for (const lesson of rights) {
    assert.ok(lesson.question.options[lesson.question.answer]);
    assert.ok(
      lesson.question.feedback && lesson.scenario && lesson.limitations.length,
    );
    assert.ok(
      lesson.sources.some((s) =>
        ["constitution.congress.gov", "www.archives.gov"].includes(
          new URL(s.url).hostname,
        ),
      ),
    );
  }
});
test("every bill has exactly one explicitly offline explanation in both levels", () => {
  assert.equal(bills.length, 2);
  assert.equal(demos.length, bills.length);
  for (const bill of bills) {
    const matches = demos.filter((d) => d.billId === bill.id);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].mode, "offline-demo");
    for (const level of ["simple", "detailed"]) {
      assert.ok(matches[0][level].summary && matches[0][level].limitation);
      assert.ok(
        matches[0][level].points.length && matches[0][level].terms.length,
      );
    }
    assert.notEqual(matches[0].simple.summary, matches[0].detailed.summary);
    assert.ok(bill.sourceVersion && bill.latestActionDate && bill.sponsor);
  }
});
test("historical proposal and enacted law are not conflated", () => {
  const proposal = bills.find((bill) => bill.id === "us-118-s1409");
  const law = bills.find((bill) => bill.id === "us-117-s475");
  assert.equal(proposal.status, "not-enacted");
  assert.equal(proposal.latestActionDate, "2023-12-13");
  assert.equal(law.status, "enacted");
  assert.equal(law.latestActionDate, "2021-06-17");
  assert.match(law.statusLabel, /117-17/);
});
test("both cities have separate official meeting and representative links", () => {
  assert.deepEqual(
    cities.map((city) => city.id),
    ["dublin", "san-ramon"],
  );
  for (const city of cities) {
    assert.ok(city.meeting.schedule && city.meeting.location);
    assert.equal(city.roles.length, 3);
    assert.ok(city.participation.length > 0);
    assert.ok(new URL(city.meeting.url).hostname.endsWith(".gov"));
    assert.ok(new URL(city.councilUrl).hostname.endsWith(".gov"));
  }
});
