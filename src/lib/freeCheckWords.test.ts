import { test } from "node:test";
import assert from "node:assert/strict";
import {
  businessKind,
  sampleBusiness,
  moreCustomersLine,
  pillarDisplayName,
} from "./businessWords.ts";
import { cleanReviewText, biggestGap } from "./reportText.ts";
import { CHIPS, isChipVariant, pickChipVariant } from "./chipVariant.ts";

test("the category picks the kind of business", () => {
  assert.equal(businessKind("Mexican restaurant"), "food");
  assert.equal(businessKind("Coffee shop"), "food");
  assert.equal(businessKind("Wine bar"), "food");
  assert.equal(businessKind("Dentist"), "health");
  assert.equal(businessKind("Orthodontist"), "health");
  assert.equal(businessKind("Plumber"), "trades");
  assert.equal(businessKind("Roofing contractor"), "trades");
  assert.equal(businessKind("Residential roofing"), "trades");
  assert.equal(businessKind("Barber shop"), "general");
  assert.equal(businessKind(""), "general");
  assert.equal(businessKind(undefined), "general");
});

test("only a health business sees dental or patient words", () => {
  for (const kind of ["food", "trades", "general"] as const) {
    const s = sampleBusiness(kind);
    const words = `${s.personName} ${s.businessName} ${moreCustomersLine(kind)} ${pillarDisplayName("Patient Journey", kind)}`;
    assert.doesNotMatch(words, /dental|dentist|patient|dr\.|appointment/i, kind);
  }
  assert.equal(pillarDisplayName("Patient Journey", "health"), "Patient Journey");
  assert.equal(pillarDisplayName("Trust & Authority", "food"), "Trust & Authority");
  for (const kind of ["health", "food", "trades", "general"] as const) {
    assert.doesNotMatch(moreCustomersLine(kind), /book/i, kind);
  }
});

test("review text shows no HTML tags", () => {
  assert.equal(cleanReviewText("Great tacos.<br><br>Will be back!"), "Great tacos. Will be back!");
  assert.equal(cleanReviewText("Line one<br />line two"), "Line one line two");
  assert.equal(cleanReviewText("<b>Bold</b> &amp; fast"), "Bold & fast");
  assert.equal(cleanReviewText(""), "");
  assert.equal(cleanReviewText(null), "");
  assert.equal(cleanReviewText("<br>"), "");
});

test("the biggest gap is the lowest score we measured", () => {
  assert.deepEqual(
    biggestGap([
      { label: "Local Ranking", score: 80 },
      { label: "Trust & Engagement", score: 41 },
      { label: "Visual Authority", score: null },
      { label: "Customer Journey", score: 55 },
    ]),
    { label: "Trust & Engagement", score: 41 },
  );
  assert.equal(biggestGap([{ label: "X", score: null }]), null);
  assert.equal(biggestGap([]), null);
  assert.equal(biggestGap([{ label: "A", score: 50 }, { label: "B", score: 50 }])?.label, "A");
});

test("each visitor gets A or B, and B repeats A until new lines arrive", () => {
  assert.equal(pickChipVariant(() => 0.1), "A");
  assert.equal(pickChipVariant(() => 0.9), "B");
  assert.equal(isChipVariant("A"), true);
  assert.equal(isChipVariant("C"), false);
  assert.equal(isChipVariant(null), false);
  assert.equal(CHIPS.A.length, 3);
  assert.deepEqual(CHIPS.B, CHIPS.A);
});
