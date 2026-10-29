import { test } from "node:test";
import assert from "node:assert/strict";
import type { AuditStage } from "../types";
import { nextScanStep, startScanStep, STUCK_MS, type ScanStepState } from "./scanSteps.ts";

/** Runs the steps for `ms` of visible time in 250ms ticks; returns each screen shown, with when. */
function run(
  start: AuditStage,
  ms: number,
  inputsAt: (t: number) => { target: AuditStage; ready?: boolean; visible?: boolean; websiteOnly?: boolean },
) {
  let state: ScanStepState = startScanStep(start);
  const shown: [number, AuditStage][] = [[0, start]];
  for (let t = 250; t <= ms; t += 250) {
    const i = inputsAt(t);
    const next = nextScanStep(state, 250, {
      target: i.target,
      ready: i.ready ?? true,
      visible: i.visible ?? true,
      websiteOnly: i.websiteOnly ?? false,
    });
    if (next.shown !== state.shown) shown.push([t, next.shown]);
    state = next;
  }
  return shown;
}

test("the server jumping from website to competitors still shows the listing for 5s", () => {
  // The listing finished before the website check: the page only ever sees 1, then 4.
  const shown = run("scanning_website", 20000, (t) => ({ target: t < 3000 ? "scanning_website" : "competitor_map" }));
  assert.deepEqual(shown, [
    [0, "scanning_website"],
    [3000, "analyzing_gbp"],
    [8000, "competitor_map"],
  ]);
});

test("the server already finished: every screen still shows, in order, none skipped", () => {
  const shown = run("scanning_website", 20000, () => ({ target: "dashboard" }));
  assert.deepEqual(shown, [
    [0, "scanning_website"],
    [250, "analyzing_gbp"],
    [5250, "competitor_map"],
    [9750, "dashboard"],
  ]);
});

test("the listing's 5s starts once it is drawn", () => {
  const shown = run("analyzing_gbp", 12000, (t) => ({ target: "competitor_map", ready: t > 2000 }));
  assert.deepEqual(shown, [[0, "analyzing_gbp"], [7000, "competitor_map"]]);
});

test("time with the tab hidden does not count", () => {
  // Hidden for the first 4s: the listing then needs 5 more visible seconds.
  const shown = run("analyzing_gbp", 12000, (t) => ({ target: "competitor_map", visible: t > 4000 }));
  assert.deepEqual(shown, [[0, "analyzing_gbp"], [9000, "competitor_map"]]);
});

test("a slow server holds the screen: nothing moves while the server is still on it", () => {
  const shown = run("analyzing_gbp", 30000, () => ({ target: "analyzing_gbp" }));
  assert.deepEqual(shown, [[0, "analyzing_gbp"]]);
});

test("a listing that never arrives is left after STUCK_MS", () => {
  const shown = run("analyzing_gbp", STUCK_MS + 1000, () => ({ target: "competitor_map", ready: false }));
  assert.deepEqual(shown, [[0, "analyzing_gbp"], [STUCK_MS, "competitor_map"]]);
});

test("no Google listing: straight to the report, as before", () => {
  const shown = run("analyzing_gbp", 2000, () => ({ target: "dashboard", websiteOnly: true, ready: false }));
  assert.deepEqual(shown, [[0, "analyzing_gbp"], [250, "dashboard"]]);
});

test("a report opened from its link opens on the report", () => {
  const state = nextScanStep(startScanStep("input"), 250, { target: "dashboard", ready: true, visible: true, websiteOnly: false });
  assert.equal(state.shown, "dashboard");
});

test("a retried audit goes back with the server", () => {
  const state = nextScanStep(startScanStep("competitor_map"), 250, { target: "scanning_website", ready: true, visible: true, websiteOnly: false });
  assert.equal(state.shown, "scanning_website");
});
