import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { About } from "../../XAPI";

export function getAbout(this: XAPI): AxiosPromise<About> {
  return this.requestResource(Resources.ABOUT);
}
