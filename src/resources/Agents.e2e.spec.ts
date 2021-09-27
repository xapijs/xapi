import { testAgent } from "../../test/constants";
import XAPI from "../XAPI";

const credentials: {
  endpoint: string;
  username: string;
  password: string;
}[] = JSON.parse(process.env.LRS_CREDENTIALS_ARRAY);

credentials.forEach((credential) => {
  const endpoint: string = credential.endpoint || "";
  const username: string = credential.username || "";
  const password: string = credential.password || "";
  const auth: string = XAPI.toBasicAuth(username, password);
  const xapi: XAPI = new XAPI(endpoint, auth);

  describe("agent resource", () => {
    test("can get person by agent", () => {
      return xapi.getAgent(testAgent).then((result) => {
        return expect(result.data).toBeDefined();
      });
    });
  });
});
