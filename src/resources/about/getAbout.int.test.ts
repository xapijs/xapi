import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
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
