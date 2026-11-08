import "server-only";

const DEFAULT_API_BASE_URL = "http://localhost:4000/api/v1";

function resolveApiBaseUrl(): string {
    const raw = process.env.API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

    try {
        new URL(raw);
    } catch {
        throw new Error(`API_BASE_URL is not a valid URL: "${raw}"`);
    }

    return raw.replace(/\/+$/, "");
}

export const API_BASE_URL = resolveApiBaseUrl();

type NestErrorBody = {
    statusCode?: number;
    message?: string | string[];
    error?: string;
};

export class ApiError extends Error {
    readonly status: number;
    readonly details: unknown;

    constructor(status: number, message: string, details?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

async function readErrorMessage(response: Response): Promise<{ message: string; body: unknown }> {
    const text = await response.text();
    const fallback = response.statusText || `Request failed with status ${response.status}`;

    if (text === "") {
        return { message: fallback, body: null };
    }

    try {
        const body = JSON.parse(text) as unknown;

        if (typeof body === "object" && body !== null) {
            const candidate = body as NestErrorBody;
            const message = Array.isArray(candidate.message)
                ? candidate.message.join("; ")
                : candidate.message;

            if (message) {
                return { message, body };
            }
        }

        return { message: fallback, body };
    } catch {
        return { message: text, body: text };
    }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

    const headers = new Headers(init?.headers);
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }

    let response: Response;

    try {
        response = await fetch(url, {...init, cache: "no-store", headers});
    } catch (error) {
        throw new ApiError(0, `Cannot reach the ScoreHub API at ${API_BASE_URL}. Is the backend running?`, error);
    }

    if (!response.ok) {
        const { message, body } = await readErrorMessage(response);
        throw new ApiError(response.status, message, body);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}