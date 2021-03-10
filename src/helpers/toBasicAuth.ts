import btoa from "btoa";

export function toBasicAuth(username: string, password: string): string {
  return "Basic " + btoa(`${username}:${password}`);
}
