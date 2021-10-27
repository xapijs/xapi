import { toBasicAuth } from "./toBasicAuth";

test("converts username and password into Basic Auth header", () => {
  const pairs = [
    ["tom", "1234"],
    ["BUG-mb'5#,:,fC83", "4jXGtgwY%\\'xm.k;"],
    ["Mr}VBHb^)zyc39`<", '?YrAhvP{}"s94:%%'],
  ];

  const encodedPairs = [
    "Basic dG9tOjEyMzQ=",
    "Basic QlVHLW1iJzUjLDosZkM4Mzo0alhHdGd3WSVcJ3htLms7",
    "Basic TXJ9VkJIYl4penljMzlgPDo/WXJBaHZQe30iczk0OiUl",
  ];

  const helperFunction = (pair) => toBasicAuth(pair[0], pair[1]);

  const results = pairs.map((pair, index) => {
    return encodedPairs[index] === helperFunction(pair);
  });

  return expect(results).not.toContain(false);
});

test("throws error if environment not supported", () => {
  if (typeof window !== "undefined") window.btoa = undefined;
  // eslint-disable-next-line no-global-assign
  if (Buffer) Buffer = undefined;
  expect(() => toBasicAuth("", "")).toThrowError();
});
