import { toBasicAuth } from "./toBasicAuth";

test("converts username and password into Basic Auth header", () => {
  const pairs = [
    ["tom", "1234"],
    ["BUG-mb'5#,:,fC83", "4jXGtgwY%\\'xm.k;"],
    ["Mr}VBHb^)zyc39`<", '?YrAhvP{}"s94:%%'],
  ];

  const manualFunction = (pair) =>
    `Basic ${Buffer.from(pair[0] + ":" + pair[1], "binary").toString(
      "base64"
    )}`;
  const helperFunction = (pair) => toBasicAuth(pair[0], pair[1]);

  const results = pairs.map(
    (pair) => manualFunction(pair) === helperFunction(pair)
  );

  return expect(results).not.toContain(false);
});
