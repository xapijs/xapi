import { testAgent } from "../../test/constants";
import { getCredentials } from "../../test/getCredentials";
import XAPI from "../XAPI";

getCredentials().forEach((credential) => {
  const auth: string = XAPI.toBasicAuth(
    credential.username,
    credential.password
  );
  const xapi: XAPI = new XAPI(credential.endpoint, auth);

  describe("agent resource", () => {
    test("can get person by agent", () => {
      return xapi
        .getAgent({
          agent: testAgent,
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });
  });
});
