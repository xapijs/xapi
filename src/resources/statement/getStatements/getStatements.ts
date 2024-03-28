import { AdapterPromise } from "../../../adapters";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { StatementsResponseWithAttachments, StatementsResponse } from "..";
import {
  GetStatementsParams,
  GetStatementsParamsWithAttachments,
  GetStatementsParamsWithoutAttachments,
} from "./GetStatementsParams";

export function getStatements(
  this: XAPI,
  params: GetStatementsParamsWithAttachments
): AdapterPromise<StatementsResponseWithAttachments>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsParamsWithoutAttachments
): AdapterPromise<StatementsResponse>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsParams
): AdapterPromise<StatementsResponse | StatementsResponseWithAttachments> {
  return this.requestResource({
    resource: Resources.STATEMENT,
    queryParams: {
      ...(!!params?.activity && { activity: params.activity }),
      ...(!!params?.agent && { agent: params.agent }),
      ...(!!params?.ascending && { ascending: params.ascending }),
      ...(!!params?.attachments && { attachments: params.attachments }),
      ...(!!params?.format && { format: params.format }),
      ...(!!params?.limit && { limit: params.limit }),
      ...(!!params?.registration && { registration: params.registration }),
      ...(!!params?.related_activities && {
        related_activities: params.related_activities,
      }),
      ...(!!params?.related_agents && {
        related_agents: params.related_agents,
      }),
      ...(!!params?.since && { since: params.since }),
      ...(!!params?.until && { until: params.until }),
      ...(!!params?.verb && { verb: params.verb }),
    },
    requestOptions: { useCacheBuster: params?.useCacheBuster },
  });
}
