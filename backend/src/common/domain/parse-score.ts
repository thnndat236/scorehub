import { ScoreValue } from "./score-value";

export type ScoreResult =
    | { kind: "blank" }
    | { kind: "invalid" }
    | { kind: "ok"; score: ScoreValue };

export function parseScore(raw: string | undefined): ScoreResult {
    const value = (raw ?? "").trim();

    if (value === "") {
        return { kind: "blank" };
    }

    try {
        return { kind: "ok", score: ScoreValue.fromNumber(Number(value)) };
    } catch (error) {
        if (error instanceof RangeError) {
            return { kind: "invalid" };
        }
        throw error;
    }
}
