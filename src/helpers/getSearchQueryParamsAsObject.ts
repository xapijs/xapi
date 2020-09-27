import { Actor } from "../interfaces/Statement";

function coerceActor(actor: Actor): Actor {
  const actorKeys = ["name", "mbox", "account"];
  actorKeys.forEach((actorKey) => {
    if (Array.isArray(actor[actorKey])) {
      switch(actorKey) {
        case "account": {
          actor[actorKey] = {
            ...(actor.account[0].accountServiceHomePage ? {homePage: actor.account[0].accountServiceHomePage} : null),
            ...(actor.account[0].accountName ? {name: actor.account[0].accountName} : null),
          };
          break;
        }
        default: {
          actor[actorKey] = actor[actorKey][0];
        }
      }
    }
  });
  return actor;
}

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
    if (key === "actor") {
      obj.actor = coerceActor(obj.actor);
    }
  });
  return obj;
}
