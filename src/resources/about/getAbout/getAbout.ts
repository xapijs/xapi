import { AxiosPromise } from "axios";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { About } from "../About";
import { GetAboutParams } from "./GetAboutParams";

export function getAbout(
  this: XAPI,
  params?: GetAboutParams
): AxiosPromise<About> {
  return this.requestResource({
    resource: Resources.ABOUT,
    requestOptions: {
      useCacheBuster: params?.useCacheBuster,
    },
  });
}
