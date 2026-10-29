import { test } from "node:test";
import assert from "node:assert/strict";
import { nextBrowseStop, browseDuration, browsePause } from "./browseStops.ts";

const seq = (...values: number[]) => { let i = 0; return () => values[i++ % values.length]; };

test("every fourth move goes back to the top", () => {
  assert.equal(nextBrowseStop(0.7, 4, seq(0.9)), 0);
  assert.equal(nextBrowseStop(0.3, 8, seq(0.9)), 0);
});

test("a move always travels at least a fifth of the page", () => {
  for (let move = 1; move < 40; move++) {
    if (move % 4 === 0) continue;
    for (const current of [0, 0.1, 0.5, 0.9, 1]) {
      const next = nextBrowseStop(current, move);
      assert.ok(next >= 0 && next <= 1, `stop ${next} out of range`);
      assert.ok(Math.abs(next - current) >= 0.2, `moved only from ${current} to ${next}`);
    }
  }
});

test("when chance keeps picking nearby spots, it still jumps far", () => {
  assert.equal(nextBrowseStop(0.4, 1, seq(0.45)), 0.85);
  assert.equal(nextBrowseStop(0.6, 1, seq(0.55)), 0.15);
});

test("moves take 0.9s to 2.6s and pauses 0.6s to 1.5s", () => {
  assert.equal(browseDuration(0, 0.01, 5000), 0.9);
  assert.equal(browseDuration(0, 1, 50000), 2.6);
  assert.equal(browseDuration(0, 0.5, 3600), 2);
  assert.equal(browsePause(seq(0)), 0.6);
  assert.equal(browsePause(seq(1)), 1.5);
});
