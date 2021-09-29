import { testActivity } from "../../test/constants";
import { getCredentials } from "../../test/getCredentials";
import XAPI from "../XAPI";

getCredentials().forEach((credential) => {
  const auth: string = XAPI.toBasicAuth(
    credential.username,
    credential.password
  );
  const xapi: XAPI = new XAPI(credential.endpoint, auth);

  describe("activities resource", () => {
    test("can get activity", () => {
      return xapi
        .getActivity({
          activityId: testActivity.id,
        })
        .then((result) => {
          return expect(result.data).toMatchObject(testActivity);
        });
    });
  });
});
