import { TinCanLaunchData } from "../XAPI";
import { getTinCanLaunchData } from "./getTinCanLaunchData";
import { testIf, isNode } from "../../test/jestUtils";

testIf(!isNode())("it returns launch data in browser environment", () => {
  const params: TinCanLaunchData = {
    auth: "abcdefgh",
    endpoint: "http://www.abcdefgh.com/",
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

  const tinCanLaunchData = getTinCanLaunchData();
  expect(tinCanLaunchData).toEqual(params);
});

testIf(isNode())("it throws an error in node environment", () => {
  try {
    getTinCanLaunchData();
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});
