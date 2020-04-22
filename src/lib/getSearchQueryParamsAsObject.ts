export function getSearchQueryParamsAsObject(str: string): {[key: string]: any} {
  let obj: {[key: string]: string} = {};
  str
    .split("?")[1]
    .split("&")
    .forEach((n: string) => {
      let item: string[] = n.split("=");
      let decodedItem: string = decodeURIComponent(item[1]);
      try {
        obj[item[0]] = JSON.parse(decodedItem);
      } catch {
        obj[item[0]] = decodedItem;
      }
    });
  return obj;
}
