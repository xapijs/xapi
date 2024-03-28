import { AdapterPromise } from "../../../adapters";
import XAPI from "../../../XAPI";
import { StatementsResponse, StatementsResponseWithAttachments } from "..";
import { GetMoreStatementsParams } from "./GetMoreStatementsParams";

export function getMoreStatements(
  this: XAPI,
  params: GetMoreStatementsParams
): AdapterPromise<StatementsResponse | StatementsResponseWithAttachments> {
  const endpoint = new URL(this.endpoint);
  const url = `${endpoint.protocol}//${endpoint.host}${params.more}`;
  return this.requestURL(url);
}
