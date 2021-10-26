import { AxiosPromise } from "axios";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { StatementsResponseWithAttachments, StatementsResponse } from "..";
import {
  GetStatementsParams,
  GetStatementsParamsWithAttachments,
  GetStatementsParamsWithoutAttachments,
} from "./getStatementsParams";

export function getStatements(
  this: XAPI,
  params: GetStatementsParamsWithAttachments
): AxiosPromise<StatementsResponseWithAttachments>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsParamsWithoutAttachments
): AxiosPromise<StatementsResponse>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsParams
): AxiosPromise<StatementsResponse | StatementsResponseWithAttachments> {
  return this.requestResource(
    Resources.STATEMENT,
    {
      ...(params?.activity !== undefined ? { activity: params.activity } : {}),
      ...(params?.agent !== undefined ? { agent: params.agent } : {}),
      ...(params?.ascending !== undefined
        ? { ascending: params.ascending }
        : {}),
      ...(params?.attachments !== undefined
        ? { attachments: params.attachments }
        : {}),
      ...(params?.format !== undefined ? { format: params.format } : {}),
      ...(params?.limit !== undefined ? { limit: params.limit } : {}),
      ...(params?.registration !== undefined
        ? { registration: params.registration }
        : {}),
      ...(params?.related_activities !== undefined
        ? { related_activities: params.related_activities }
        : {}),
      ...(params?.related_agents !== undefined
        ? { related_agents: params.related_agents }
        : {}),
      ...(params?.since !== undefined ? { since: params.since } : {}),
      ...(params?.until !== undefined ? { until: params.until } : {}),
      ...(params?.verb !== undefined ? { verb: params.verb } : {}),
    },
    undefined,
    {
      useCacheBuster: params?.useCacheBuster,
    }
  );
}
