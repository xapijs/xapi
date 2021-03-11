export function toBasicAuth(username: string, password: string): string {
  return `Basic ${Buffer.from(username + ":" + password, "binary").toString(
    "base64"
  )}`;
}
