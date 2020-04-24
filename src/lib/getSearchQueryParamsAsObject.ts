export function getSearchQueryParamsAsObject(str: string): {[key: string]: any} {
  const obj: {[key: string]: any} = {};
  str
    .split("?")[1]
    .split("&")
    .forEach((n: string) => {
      const item: string[] = n.split("=");
      const decodedItem: string = decodeURIComponent(item[1]);
      try {
        obj[item[0]] = JSON.parse(decodedItem);
      } catch {
        obj[item[0]] = decodedItem;
      }
    });
  return obj;
}
