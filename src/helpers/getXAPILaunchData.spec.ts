import { getXAPILaunchData } from "./getXAPILaunchData";

describe("xapi launch", () => {
  test("catch error if failure to get data", () => {
    return getXAPILaunchData().catch((error) => {
      return expect(error).toBeInstanceOf(Error);
    });
  });
});
