import { AxiosPromise } from "axios";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { About } from "../About";

export function getAbout(this: XAPI): AxiosPromise<About> {
  return this.requestResource(Resources.ABOUT);
}
