import { getXAPILaunchData } from "./getXAPILaunchData";
import { testIf, isNode } from "../../../test/jestUtils";

testIf(isNode())("return error in node environment", () => {
  return getXAPILaunchData().catch((error: Error) => {
    return expect(error.message).toBe(
      "Environment does not support location.search"
    );
  });
});

testIf(!isNode())(
  "return error if xAPILaunchService params not present in URL",
  () => {
    return getXAPILaunchData().catch((error: Error) => {
      return expect(error.message).toBe(
        "xAPILaunchService parameter not found in URL."
      );
    });
  }
);
