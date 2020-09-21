export function getSearchQueryParamsAsObject(str: string): {[key: string]: any} {
  const obj: {[key: string]: any} = {};
  const queryString = str.split("?")[1] || null;
  if (!queryString) return obj;
  const items = queryString.split("&");
  items.forEach((n: string) => {
    const item: string[] = n.split("=");
    const key = item[0];
    const val = item[1];
    const decodedItem: string = decodeURIComponent(val);
    try {
      obj[key] = JSON.parse(decodedItem);
    } catch {
      obj[key] = decodedItem;
    }
    // Coerce actor name & mbox properties from arrays to strings if found
    if (key === "actor") {
      const actorKeys = ["name", "mbox"];
      actorKeys.forEach((actorKey) => {
        if (Array.isArray(obj[key][actorKey])) {
          obj[key][actorKey] = obj[key][actorKey][0];
        }
      });
    }
  });
  return obj;
}
