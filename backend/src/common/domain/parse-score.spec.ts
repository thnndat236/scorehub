import { parseScore } from "./parse-score";
import { ScoreValue } from "./score-value";

function expectOk(input: string, expected: number): void {
    const result = parseScore(input);

    expect(result.kind).toBe("ok");

    if (result.kind !== "ok") {
        throw new Error(`Expected an "ok" result for ${input}`);
    }

    expect(result.score).toBeInstanceOf(ScoreValue);
    expect(result.score.value).toBe(expected);
}

describe("parseScore", () => {
    it.each([
        { input: undefined },
        { input: "" },
        { input: "   " }
    ])("returns blank for $input", ({ input }) => {
        expect(parseScore(input)).toEqual({ kind: "blank" });
    });

    it.each([
        { input: "0", expected: 0 },
        { input: "0.00", expected: 0 },
        { input: " 8.40 ", expected: 8.4 },
        { input: "10", expected: 10 }
    ])("parses $input as valid score $expected", ({ input, expected }) => {
        expectOk(input, expected);
    });

    it.each([
        { input: "11" },
        { input: "-1" },
        { input: "abc" },
        { input: "NaN" },
        { input: "Infinity" },
        { input: "-Infinity" }
    ])("returns invalid for $input", ({ input }) => {
        expect(parseScore(input)).toEqual({ kind: "invalid" });
    });

    it("never treats a blank cell as zero", () => {
        expect(parseScore("")).toEqual({ kind: "blank" });
        expect(parseScore("0")).toEqual({
            kind: "ok",
            score: ScoreValue.fromNumber(0)
        });
        expect(parseScore("")).not.toEqual(parseScore("0"));
    });
});
