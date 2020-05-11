export function getSearchQueryParamsAsObject(str: string): {[key: string]: any} {
  const obj: {[key: string]: any} = {};
  const queryString = str.split("?")[1] || "";
  const items = queryString.split("&");
  items.forEach((n: string) => {
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
