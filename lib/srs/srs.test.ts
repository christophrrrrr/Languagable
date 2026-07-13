import { describe, it, expect } from "vitest";
import { newFsrsCard, reviewFsrsCard } from "./index";

describe("srs wrapper", () => {
  it("creates a new card in State New (0)", () => {
    const c = newFsrsCard(new Date("2026-01-01T00:00:00Z"));
    expect(c.state).toBe(0);
    expect(c.reps).toBe(0);
  });

  it("advances state and schedules a future due on Good", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const r = reviewFsrsCard(newFsrsCard(now), "good", now);
    expect(r.prevState).toBe(0);
    expect(r.state).not.toBe(0);
    expect(r.due.getTime()).toBeGreaterThan(now.getTime());
    expect(r.card.reps).toBe(1);
  });

  it("round-trips serialized card across reviews", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const first = reviewFsrsCard(newFsrsCard(now), "good", now);
    const second = reviewFsrsCard(
      first.card,
      "good",
      new Date("2026-01-02T00:00:00Z"),
    );
    expect(second.card.reps).toBe(2);
  });
});
