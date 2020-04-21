export function getSearchQueryParamsAsObject(str: string): {[key: string]: string} {
  let obj: {[key: string]: string} = {};
  str
    .split("?")[1]
    .split("&")
    .forEach((n: any) => {
      let item = n.split("=");
      obj[item[0]] = item[1];
    });
  return obj;
}