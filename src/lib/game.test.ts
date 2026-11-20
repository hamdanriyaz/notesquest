import { describe, it, expect } from "vitest";
import { applyAnswer, arrangeWaves, hpFor, timeFor, type Question } from "./game";
import { generateQuestions } from "./questionGen";

describe("game rules", () => {
  it("mob 100 HP / 15s, boss 300 HP / 25s", () => {
    expect([hpFor("mob"), timeFor("mob"), hpFor("boss"), timeFor("boss")]).toEqual([100, 15, 300, 25]);
  });
  it("3 correct in a row restores 1 shield", () => {
    let s = { shields: 2, streak: 0, score: 0 };
    s = applyAnswer(s, true, "mob"); s = applyAnswer(s, true, "mob");
    expect(s.shields).toBe(2);
    expect(applyAnswer(s, true, "mob").shields).toBe(3);
  });
  it("wrong answer shatters 1 shield and resets streak", () => {
    const r = applyAnswer({ shields: 3, streak: 2, score: 0 }, false, "boss");
    expect(r.shields).toBe(2); expect(r.streak).toBe(0);
  });
  it("bosses land on every 4th and final wave", () => {
    const qs: Question[] = Array.from({ length: 8 }, (_, i) => ({ q: "q" + i, options: ["a", "b", "c", "d"], answer: 0, explain: "", kind: i < 6 ? "mob" : "boss" }));
    const w = arrangeWaves(qs).map((q) => q.kind);
    expect(w[3]).toBe("boss"); expect(w[7]).toBe("boss"); expect(w.filter((k) => k === "boss").length).toBe(2);
  });
  it("generates MCQs with 4 options from notes", () => {
    const notes = "Overfitting is when a model memorizes noise in training data and fails on new data. Underfitting is when a model is too simple to capture patterns. Regularization is a technique that penalizes model complexity to reduce variance. Precision is the ratio of true positives to all predicted positives. Recall is the ratio of true positives to all actual positives. Gradient descent is an optimization algorithm that iteratively updates parameters. Normalization is the process of scaling features into a common range. A decision tree is a model that splits data using feature thresholds into branches. Bagging is an ensemble method that trains models on bootstrap samples. Clustering is an unsupervised method that groups similar points together.";
    const qs = generateQuestions(notes, 10);
    expect(qs.length).toBeGreaterThanOrEqual(8);
    qs.forEach((q) => expect(q.options.length).toBe(4));
  });
});

import { rollLoot, specialFill, SPECIAL_BONUS } from "./game";
import { nextDaily, currentStreak } from "./daily";
describe("new mechanics", () => {
  it("5-streak fires special attack worth +500", () => {
    const a = applyAnswer({ shields: 3, streak: 4, score: 0 }, true, "mob", 0);
    const b = applyAnswer({ shields: 3, streak: 3, score: 0 }, true, "mob", 0);
    expect(a.special).toBe(true); expect(b.special).toBe(false);
    expect(a.score - SPECIAL_BONUS).toBe(300); expect(specialFill(5)).toBe(1);
  });
  it("boss answered within 5s hits weak point for x2", () => {
    const fast = applyAnswer({ shields: 3, streak: 0, score: 0 }, true, "boss", 0, 4);
    const slow = applyAnswer({ shields: 3, streak: 0, score: 0 }, true, "boss", 0, 6);
    expect(fast.weak).toBe(true); expect(fast.score).toBe(600); expect(slow.score).toBe(300);
    expect(applyAnswer({ shields: 3, streak: 0, score: 0 }, true, "mob", 0, 1).weak).toBe(false);
  });
  it("loot: 30% drop, shield if damaged else extra time", () => {
    expect(rollLoot(2, 0.1)).toBe("shield"); expect(rollLoot(3, 0.1)).toBe("time"); expect(rollLoot(2, 0.5)).toBeNull();
  });
  it("daily streak grows on consecutive days, resets after a gap", () => {
    let d = nextDaily({ streak: 0, last: null }, "2026-11-18");
    d = nextDaily(d, "2026-11-19"); d = nextDaily(d, "2026-11-19");
    expect(d.streak).toBe(2);
    expect(nextDaily(d, "2026-11-22").streak).toBe(1);
    expect(currentStreak(d, "2026-11-21")).toBe(0);
  });
});
