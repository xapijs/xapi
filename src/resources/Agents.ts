import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import XAPI, { Agent, Person } from "../XAPI";

export function getAgent(this: XAPI, agent: Agent): AxiosPromise<Person> {
  return this.requestResource(Resources.AGENTS, {
    agent: agent,
  });
}
