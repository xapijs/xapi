import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import { GetAgentParams } from "../interfaces/Actor/AgentParams";
import XAPI, { Person } from "../XAPI";

export function getAgent(
  this: XAPI,
  params: GetAgentParams
): AxiosPromise<Person> {
  return this.requestResource(Resources.AGENTS, {
    agent: params.agent,
  });
}
