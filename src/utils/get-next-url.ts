export function getNextUrl(): string {
  if (process.env.NEXT_URL != null) return process.env.NEXT_URL; // SSR should use next url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}
