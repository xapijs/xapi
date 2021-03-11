export function toBasicAuth(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  if (typeof window !== "undefined" && window.btoa) {
    return `Basic ${btoa(credentials)}`;
  } else if (typeof Buffer !== "undefined") {
    return `Basic ${Buffer.from(credentials, "binary").toString("base64")}`;
  }
  throw new Error("Environment does not support base64 conversion.");
}
