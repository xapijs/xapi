export function formatEndpoint(endpoint: string): string {
  return endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
}
