import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Person } from "../../XAPI";
import { GetAgentParams } from "./getAgentParams";

export function getAgent(
  this: XAPI,
  params: GetAgentParams
): AxiosPromise<Person> {
  return this.requestResource(Resources.AGENTS, {
    agent: params.agent,
  });
}
