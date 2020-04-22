import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";
import { Actor } from "../";

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

test("can parse JSON objects in querystring", () => {
  let actor: Actor = {
    objectType: "Agent",
    mbox: "test@test.com"
  }
  let strinifyEncoded: string = encodeURIComponent(JSON.stringify(actor))
  return expect(getSearchQueryParamsAsObject(`?actor=${strinifyEncoded}`)).toMatchObject({
    actor: actor
  });
})
