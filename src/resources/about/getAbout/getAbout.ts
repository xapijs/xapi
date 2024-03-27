import { AdapterPromise } from "../../../adapters";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { About } from "../About";
import { GetAboutParams } from "./GetAboutParams";

export function getAbout(
  this: XAPI,
  params?: GetAboutParams
): AdapterPromise<About> {
  return this.requestResource({
    resource: Resources.ABOUT,
    requestOptions: {
      useCacheBuster: params?.useCacheBuster,
    },
  });
}
