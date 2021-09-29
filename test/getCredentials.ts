interface Credential {
  endpoint: string;
  username: string;
  password: string;
}

export function getCredentials(): Credential[] {
  return JSON.parse(process.env.LRS_CREDENTIALS_ARRAY);
}
