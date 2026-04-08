function normalizeNoTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function assertProdUrlSafe(name: string, url: string) {
  const lowered = url.toLowerCase();
  if (lowered.includes("localhost") || lowered.includes("127.0.0.1")) {
    throw new Error(
      `[env] ${name} must not point to localhost in production. Got: ${url}`,
    );
  }
}

export function getApiBaseUrl(): string {
  const configured = (import.meta.env.VITE_BASE_URL as string | undefined)?.trim();
  if (import.meta.env.PROD) {
    if (!configured) {
      throw new Error("[env] VITE_BASE_URL is required in production.");
    }
    assertProdUrlSafe("VITE_BASE_URL", configured);
    return normalizeNoTrailingSlash(configured);
  }

  // Local dev fallback only
  return normalizeNoTrailingSlash(configured || "http://localhost:3333/api");
}

export function getImageBaseUrl(): string {
  const configured = (import.meta.env.VITE_BASE_IMAGE_URL as string | undefined)?.trim();
  if (import.meta.env.PROD) {
    if (!configured) {
      throw new Error("[env] VITE_BASE_IMAGE_URL is required in production.");
    }
    assertProdUrlSafe("VITE_BASE_IMAGE_URL", configured);
    return normalizeNoTrailingSlash(configured);
  }

  // Local dev fallback only
  return normalizeNoTrailingSlash(configured || "http://localhost:3333");
}

