import { test } from "node:test";
import assert from "node:assert/strict";
import { nextBrowseStop, browseDuration, browsePause, JUMPS } from "./browseStops.ts";

const seq = (...values: number[]) => { let i = 0; return () => values[i++ % values.length]; };

test("every fourth move goes back to the top", () => {
  assert.equal(nextBrowseStop(0.7, 4, seq(0.9)), 0);
  assert.equal(nextBrowseStop(0.3, 8, seq(0.9)), 0);
});

test("the size picker gives small, medium and large jumps", () => {
  // first draw picks the size, second the distance inside it, third the direction (>= 0.5 = down)
  assert.equal(nextBrowseStop(0.5, 1, seq(0.1, 0, 0.9)), 0.5 + JUMPS.small[0]);
  assert.equal(nextBrowseStop(0.5, 1, seq(0.5, 0, 0.9)), 0.5 + JUMPS.medium[0]);
  assert.equal(nextBrowseStop(0.1, 1, seq(0.9, 0, 0.9)), 0.1 + JUMPS.large[0]);
  assert.equal(nextBrowseStop(0.5, 1, seq(0.1, 0, 0.1)), 0.5 - JUMPS.small[0]);
});

test("a jump that would run off the page goes the other way, or to the far end", () => {
  assert.equal(nextBrowseStop(0.95, 1, seq(0.5, 0, 0.9)), 0.8); // down is off the page, so up
  assert.equal(nextBrowseStop(0.5, 1, seq(0.9, 0.999, 0.9)), 0); // too big both ways: far end
});

test("over many random moves, all three sizes show up and every stop stays on the page", () => {
  const seen = { small: 0, medium: 0, large: 0 };
  let at = 0;
  for (let move = 1; move < 2000; move++) {
    const next = nextBrowseStop(at, move);
    assert.ok(next >= 0 && next <= 1, `stop ${next} off the page`);
    assert.notEqual(next, at, "every move moves");
    if (move % 4 !== 0) {
      const d = Math.abs(next - at);
      if (d <= JUMPS.small[1] + 0.001) seen.small++;
      else if (d <= JUMPS.medium[1] + 0.001) seen.medium++;
      else seen.large++;
    }
    at = next;
  }
  assert.ok(seen.small > 100 && seen.medium > 100 && seen.large > 100, JSON.stringify(seen));
});

test("moves take a random 0.8s to 2.6s, pauses 0.6s to 1.5s", () => {
  assert.equal(browseDuration(seq(0)), 0.8);
  assert.equal(browseDuration(seq(1)), 2.6);
  for (let i = 0; i < 500; i++) {
    const d = browseDuration();
    assert.ok(d >= 0.8 && d <= 2.6, `duration ${d}`);
  }
  assert.equal(browsePause(seq(0)), 0.6);
  assert.equal(browsePause(seq(1)), 1.5);
});
