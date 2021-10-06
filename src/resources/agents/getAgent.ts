import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Agent, Person } from "../../XAPI";

export interface GetAgentParams {
  agent: Agent;
}

export function getAgent(
  this: XAPI,
  params: GetAgentParams
): AxiosPromise<Person> {
  return this.requestResource(Resources.AGENTS, {
    agent: params.agent,
  });
}
