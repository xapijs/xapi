import { Extensions } from "../../XAPI";

export interface About {
  /**
   * xAPI versions this LRS supports
   */
  version: string[];
  /**
   * Extensions this LRS supports
   */
  extensions?: Extensions;
}
