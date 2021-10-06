import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Person, GetAgentParams } from "../../XAPI";

export function getAgent(
  this: XAPI,
  params: GetAgentParams
): AxiosPromise<Person> {
  return this.requestResource(Resources.AGENTS, {
    agent: params.agent,
  });
}
