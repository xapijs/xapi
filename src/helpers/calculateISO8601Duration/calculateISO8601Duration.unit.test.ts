import { calculateISO8601Duration } from "./calculateISO8601Duration";

test("should create correct timestring for seconds", () => {
  const startDate: Date = new Date();
  const endDate: Date = new Date(startDate);
  endDate.setSeconds(endDate.getSeconds() + 1);
  expect(calculateISO8601Duration(startDate, endDate)).toEqual("PT1S");
});

test("should create correct timestring for minutes", () => {
  const startDate: Date = new Date();
  const endDate: Date = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 1);
  expect(calculateISO8601Duration(startDate, endDate)).toEqual("PT1M");
});

test("should create correct timestring for hours", () => {
  const startDate: Date = new Date();
  const endDate: Date = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);
  expect(calculateISO8601Duration(startDate, endDate)).toEqual("PT1H");
});

test("should create correct timestring for days", () => {
  const startDate: Date = new Date();
  const endDate: Date = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  expect(calculateISO8601Duration(startDate, endDate)).toEqual("P1DT");
});

test("should create correct timestring for seconds, hours, minutes and days", () => {
  const startDate: Date = new Date();
  const endDate: Date = new Date(startDate);
  endDate.setSeconds(endDate.getSeconds() + 1);
  endDate.setMinutes(endDate.getMinutes() + 1);
  endDate.setHours(endDate.getHours() + 1);
  endDate.setDate(endDate.getDate() + 1);
  expect(calculateISO8601Duration(startDate, endDate)).toEqual("P1DT1H1M1S");
});
