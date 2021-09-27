import { testActivity } from "../../test/constants";
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

  describe("activities resource", () => {
    test("can get activity", () => {
      return xapi.getActivity(testActivity.id).then((result) => {
        return expect(result.data).toMatchObject(testActivity);
      });
    });
  });
});
