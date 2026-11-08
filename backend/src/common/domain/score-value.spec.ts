import { ScoreLevel, ScoreValue } from "./score-value";

describe("ScoreValue", () => {
    describe("fromNumber", () => {
        it.each([0, 0.25, 4, 6.75, 8, 10])("accepts %s", (input) => {
            expect(ScoreValue.fromNumber(input).value).toBe(input);
        });

        it.each([
            -0.01,
            10.01,
            Number.NaN,
            Number.POSITIVE_INFINITY,
            Number.NEGATIVE_INFINITY
        ])("rejects %s", (input) => {
            expect(() => ScoreValue.fromNumber(input)).toThrow(RangeError);
        });

        it("requires the factory at the type level", () => {
            // @ts-expect-error ScoreValue must only be created through fromNumber()
            const direct: ScoreValue = new ScoreValue(8);
            expect(direct).toBeInstanceOf(ScoreValue);
        });

        it("is frozen after construction", () => {
            expect(Object.isFrozen(ScoreValue.fromNumber(7.5))).toBe(true);
        });
    });

    describe("classify", () => {
        it.each([
            [10, ScoreLevel.EXCELLENT],
            [8, ScoreLevel.EXCELLENT],
            [7.99, ScoreLevel.GOOD],
            [6, ScoreLevel.GOOD],
            [5.99, ScoreLevel.AVERAGE],
            [4, ScoreLevel.AVERAGE],
            [3.99, ScoreLevel.POOR],
            [0, ScoreLevel.POOR]
        ])("classifies %s as %s", (input, expected) => {
            expect(ScoreValue.fromNumber(input).classify()).toBe(expected);
        });
    });
});