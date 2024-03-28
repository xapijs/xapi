import { Adapter } from "./adapters";
import { Versions } from "./constants";

export interface XAPIConfig {
  endpoint: string;
  auth?: string;
  version?: Versions;
  adapter?: Adapter;
}
