const millisecondsInMinute = 60000;
const millisecondsInHour = millisecondsInMinute * 60;
const millisecondsInDay = millisecondsInHour * 24;

export function calculateISO8601Duration(
  startDate: Date,
  endDate: Date
): string {
  const differenceMilliseconds = endDate.getTime() - startDate.getTime();
  if (differenceMilliseconds <= 0) return "PT0S";
  const days = Math.floor(differenceMilliseconds / millisecondsInDay);
  const hoursMilliseconds = differenceMilliseconds % millisecondsInDay;
  const hours = Math.floor(hoursMilliseconds / millisecondsInHour);
  const minuteMilliseconds = hoursMilliseconds % millisecondsInHour;
  const minutes = Math.floor(minuteMilliseconds / millisecondsInMinute);
  const remainingMilliseconds = minuteMilliseconds % millisecondsInMinute;
  const seconds = remainingMilliseconds / 1000;
  return `P${days ? days + "D" : ""}T${hours ? hours + "H" : ""}${
    minutes ? minutes + "M" : ""
  }${seconds ? seconds + "S" : ""}`;
}
