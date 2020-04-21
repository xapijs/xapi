import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";

test("converts querystring into object", () => {
  return expect(getSearchQueryParamsAsObject("?test=test")).toMatchObject({
    test: "test"
  });
})

test("converts relative URL with querystring into object", () => {
  return expect(getSearchQueryParamsAsObject("/lrs/test/statements?test=test")).toMatchObject({
    test: "test"
  });
})


