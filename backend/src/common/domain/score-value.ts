export enum ScoreLevel {
    EXCELLENT = "EXCELLENT",
    GOOD = "GOOD",
    AVERAGE = "AVERAGE",
    POOR = "POOR"
}

export class ScoreValue {
    private constructor(public readonly value: number) {
        Object.freeze(this);
    }

    static fromNumber(value: number): ScoreValue {
        if (!Number.isFinite(value) || value < 0 || value > 10) {
            throw new RangeError(`Score must be a finite number between 0 and 0`);
        }
        return new ScoreValue(value);
    }

    classify(): ScoreLevel {
        if (this.value >= 8) {
            return ScoreLevel.EXCELLENT;
        }
        if (this.value >= 6 && this.value < 8) {
            return ScoreLevel.GOOD;
        }
        if (this.value >= 4 && this.value < 6) {
            return ScoreLevel.AVERAGE;
        }
        return ScoreLevel.POOR;
    }
}
