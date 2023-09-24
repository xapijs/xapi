import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";
import { Actor } from "../../XAPI";

test("handles url with no query parameters", () => {
  return expect(
    Object.keys(getSearchQueryParamsAsObject("http://localhost:1234/")).length
  ).toEqual(0);
});

test("handles empty querystring", () => {
  return expect(Object.keys(getSearchQueryParamsAsObject("")).length).toEqual(
    0
  );
});

test("converts querystring into object", () => {
  return expect(getSearchQueryParamsAsObject("?test=test")).toMatchObject({
    test: "test",
  });
});

test("converts querystring with hash into object", () => {
  return expect(
    getSearchQueryParamsAsObject("https://www.example.com?test=test#hash")
  ).toMatchObject({
    test: "test",
  });
});

test("converts querystring with multiple question marks into object", () => {
  return expect(
    getSearchQueryParamsAsObject("??test=test?&he?llo=wor?ld")
  ).toMatchObject({
    "?test": "test?",
    "he?llo": "wor?ld",
  });
});

test("can decode plus signs into spaces", () => {
  return expect(getSearchQueryParamsAsObject("?test=Test+User")).toMatchObject({
    test: "Test User",
  });
});

test("converts relative URL with querystring into object", () => {
  return expect(
    getSearchQueryParamsAsObject("/lrs/test/statements?test=test")
  ).toMatchObject({
    test: "test",
  });
});

test("can parse JSON objects in querystring", () => {
  const actor: Actor = {
    objectType: "Agent",
    mbox: "test@test.com",
  };
  const stringifyEncoded: string = encodeURIComponent(JSON.stringify(actor));
  return expect(
    getSearchQueryParamsAsObject(`?actor=${stringifyEncoded}`)
  ).toMatchObject({
    actor: actor,
  });
});

test("can coerce TinCan launch actor name if string array", () => {
  const actor: Actor = {
    objectType: "Agent",
    name: ["Test"] as any,
  };
  const stringifyEncoded: string = encodeURIComponent(JSON.stringify(actor));
  return expect(
    getSearchQueryParamsAsObject(`?actor=${stringifyEncoded}`)
  ).toMatchObject({
    actor: {
      objectType: "Agent",
      name: "Test",
    },
  });
});

test("can coerce TinCan launch actor mbox if string array", () => {
  const actor: Actor = {
    objectType: "Agent",
    mbox: ["test@test.com"] as any,
  };
  const stringifyEncoded: string = encodeURIComponent(JSON.stringify(actor));
  return expect(
    getSearchQueryParamsAsObject(`?actor=${stringifyEncoded}`)
  ).toMatchObject({
    actor: {
      objectType: "Agent",
      mbox: "test@test.com",
    },
  });
});

test("can coerce TinCan launch actor account if string array", () => {
  const actor: Actor = {
    objectType: "Agent",
    account: [
      {
        accountServiceHomePage: "http://www.example.com",
        accountName: "ABCDEFGH|test@test.com",
      },
    ] as any,
  };
  const stringifyEncoded: string = encodeURIComponent(JSON.stringify(actor));
  return expect(
    getSearchQueryParamsAsObject(`?actor=${stringifyEncoded}`)
  ).toMatchObject({
    actor: {
      objectType: "Agent",
      account: {
        homePage: "http://www.example.com",
        name: "ABCDEFGH|test@test.com",
      },
    } as Actor,
  });
});

test("can coerce TinCan launch actor account if string array with only account homepage", () => {
  const actor: Actor = {
    objectType: "Agent",
    account: [
      {
        accountServiceHomePage: "http://www.example.com",
      },
    ] as any,
  };
  const stringifyEncoded: string = encodeURIComponent(JSON.stringify(actor));
  return expect(
    getSearchQueryParamsAsObject(`?actor=${stringifyEncoded}`)
  ).toMatchObject({
    actor: {
      objectType: "Agent",
      account: {
        homePage: "http://www.example.com",
      },
    } as Actor,
  });
});

test("can coerce TinCan launch actor account if string array with only account name", () => {
  const actor: Actor = {
    objectType: "Agent",
    account: [
      {
        accountName: "ABCDEFGH|test@test.com",
      },
    ] as any,
  };
  const stringifyEncoded: string = encodeURIComponent(JSON.stringify(actor));
  return expect(
    getSearchQueryParamsAsObject(`?actor=${stringifyEncoded}`)
  ).toMatchObject({
    actor: {
      objectType: "Agent",
      account: {
        name: "ABCDEFGH|test@test.com",
      },
    } as Actor,
  });
});
