import { getCredentials } from "../../test/getCredentials";
import XAPI from "../XAPI";

getCredentials().forEach((credential) => {
  const auth: string = XAPI.toBasicAuth(
    credential.username,
    credential.password
  );
  const xapi: XAPI = new XAPI(credential.endpoint, auth);

  describe("about resource", () => {
    test("can get about", () => {
      return xapi.getAbout().then((result) => {
        return expect(result.data).toEqual(
          expect.objectContaining({
            version: expect.any(Array),
          })
        );
      });
    });
  });
});
