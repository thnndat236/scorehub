import { ApiError } from "@/lib/api/client";
import { getHealth, getOverview } from "@/lib/api/endpoints";
import type { HealthResponse, OverviewResponse } from "@/lib/api/types";

export const dynamic = "force-dynamic";

type ProbeResult =
  | {
      ok: true;
      health: HealthResponse;
      overview: OverviewResponse;
    }
  | {
      ok: false;
      message: string;
    };

async function loadProbe(): Promise<ProbeResult> {
  try {
    const [health, overview] = await Promise.all([
      getHealth(),
      getOverview()
    ]);

    return { ok: true, health, overview };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? `API error ${error.status}: ${error.message}`
        : error instanceof Error
          ? error.message
          : String(error);

    return { ok: false, message };
  }
}

export default async function Home() {
  const result = await loadProbe();

  return (
    <main className="p-8 font-mono text-sm">
      <h1 className="mb-4 text-xl font-semibold">ScoreHub API probe</h1>

      {result.ok ? (
        <pre>
          {JSON.stringify(
            { health: result.health, overview: result.overview },
            null,
            2
          )}
        </pre>
      ) : (
        <p className="text-red-600">{result.message}</p>
      )}
    </main>
  );
}
