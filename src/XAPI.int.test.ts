import { forEachLRS } from "../test/getCredentials";
import XAPI from "./XAPI";

forEachLRS((_xapi, credential) => {
  const endpoint: string = credential.endpoint || "";

  describe("xapi constructor", () => {
    test("can perform basic authentication challenges when no authorization process is required", () => {
      const noAuthXapi = new XAPI(endpoint);
      expect(noAuthXapi.getAbout()).resolves.toBeDefined();
    });
  });
});
