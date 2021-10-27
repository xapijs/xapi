import { AxiosPromise } from "axios";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { Person } from "../Person";
import { GetAgentParams } from "./GetAgentParams";

export function getAgent(
  this: XAPI,
  params: GetAgentParams
): AxiosPromise<Person> {
  return this.requestResource({
    resource: Resources.AGENTS,
    queryParams: {
      agent: params.agent,
    },
    requestOptions: {
      useCacheBuster: params.useCacheBuster,
    },
  });
}
