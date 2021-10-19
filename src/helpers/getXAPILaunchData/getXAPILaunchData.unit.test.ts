import { getXAPILaunchData } from "./getXAPILaunchData";
import { testIf, isNode } from "../../../test/jestUtils";
import axios from "axios";
import { XAPILaunchParameters } from "./XAPILaunchParameters";

jest.mock("axios");

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

testIf(!isNode())("can request launch data from url", async () => {
  const params: XAPILaunchParameters = {
    xAPILaunchService: "https://my.launch.service/",
    xAPILaunchKey: "test-launch-key",
  };

  const search =
    "?" +
    Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");

  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });

  (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
    headers: {
      "content-type": "application/json",
    },
  });
  const launchURL: URL = new URL(params.xAPILaunchService);
  launchURL.pathname += `launch/${params.xAPILaunchKey}`;
  await getXAPILaunchData();
  expect(axios.request).toHaveBeenCalledWith(
    expect.objectContaining({
      method: "POST",
      url: launchURL.toString(),
    })
  );
});
