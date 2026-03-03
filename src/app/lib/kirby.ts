// In dev, Vite can't run PHP — serve static JSON fixtures from /mock instead.
// In production, Kirby handles all /cms/* routes via PHP.
const KIRBY_BASE_URL = import.meta.env.DEV ? '/mock' : '/cms';

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
