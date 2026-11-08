const countFormatter = new Intl.NumberFormat("en-US");

export function formatCount(value: number): string {
    return countFormatter.format(value);
}

export function formatScore(value: number | null, digits = 2): string {
    return value === null ? "—" : value.toFixed(digits);
}

export function formatPercentage(value: number, digits = 2): string {
    return `${value.toFixed(digits)}%`;
}
