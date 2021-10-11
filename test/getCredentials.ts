import XAPI from "../src/XAPI";

interface Credential {
  endpoint: string;
  username: string;
  password: string;
}

function getLRSCredentialsArray(): Credential[] {
  return JSON.parse(process.env.LRS_CREDENTIALS_ARRAY);
}

export function forEachLRS(
  callbackfn: (xapi: XAPI, credential: Credential) => void
): void {
  const credentials = getLRSCredentialsArray();
  credentials.forEach((credential) => {
    const auth: string = XAPI.toBasicAuth(
      credential.username,
      credential.password
    );
    const xapi: XAPI = new XAPI({
      endpoint: credential.endpoint,
      auth: auth,
    });
    callbackfn(xapi, credential);
  });
}
