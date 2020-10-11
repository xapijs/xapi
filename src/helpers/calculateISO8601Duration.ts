const secondsInMinute = 60;
const secondsInHour = secondsInMinute * 60;
const secondsInDay = secondsInHour * 24;

export function calculateISO8601Duration(
  startDate: Date,
  endDate: Date
): string {
  const differenceSeconds = (endDate.getTime() - startDate.getTime()) / 1000;
  const days = Math.floor(differenceSeconds / secondsInDay);
  const hoursSeconds = differenceSeconds % secondsInDay;
  const hours = Math.floor(hoursSeconds / secondsInHour);
  const minuteSeconds = hoursSeconds % secondsInHour;
  const minutes = Math.floor(minuteSeconds / secondsInMinute);
  const remainingSeconds = minuteSeconds % secondsInMinute;
  const seconds = Math.ceil(remainingSeconds);
  return `P${days ? days + "D" : ""}T${hours ? hours + "H" : ""}${
    minutes ? minutes + "M" : ""
  }${seconds ? seconds + "S" : ""}`;
}
