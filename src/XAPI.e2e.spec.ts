import { getCredentials } from "../test/getCredentials";
import XAPI from "./XAPI";

getCredentials().forEach((credential) => {
  const endpoint: string = credential.endpoint || "";

  describe("xapi constructor", () => {
    test("can perform basic authentication challenges when no authorization process is required", () => {
      const noAuthXapi = new XAPI(endpoint);
      expect(noAuthXapi.getAbout()).resolves.toBeDefined();
    });
  });
});
