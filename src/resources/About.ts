import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import { About } from "../interfaces/About/About";
import XAPI from "../XAPI";

export function getAbout(this: XAPI): AxiosPromise<About> {
  return this.requestResource(Resources.ABOUT);
}
