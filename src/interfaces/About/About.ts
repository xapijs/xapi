import { Extensions } from "..";

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
