// Local (exit-wave-faith.test): Herd serves public/cms/ at root — no /cms prefix
// Production (exitwave.band): Kirby lives at /cms subdirectory
const KIRBY_BASE_URL = window.location.hostname === 'exit-wave-faith.test' ? '' : '/cms';

export class KirbyFetchError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly endpoint: string,
  ) {
    super(message);
    this.name = 'KirbyFetchError';
  }
}

export async function kirbyFetch<TResponse>(
  endpoint: string,
  options?: RequestInit,
): Promise<TResponse> {
  const url = `${KIRBY_BASE_URL}/${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new KirbyFetchError(
      `Kirby request failed: ${response.statusText}`,
      response.status,
      endpoint,
    );
  }

  return response.json() as Promise<TResponse>;
}
