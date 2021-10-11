import { AxiosPromise } from "axios";
import XAPI from "../../../XAPI";
import { StatementsResponse, StatementsResponseWithAttachments } from "..";
import { GetMoreStatementsParams } from "./getMoreStatementsParams";

export function getMoreStatements(
  this: XAPI,
  params: GetMoreStatementsParams
): AxiosPromise<StatementsResponse | StatementsResponseWithAttachments> {
  const endpoint = new URL(this.endpoint);
  const url = `${endpoint.protocol}//${endpoint.host}${params.more}`;
  return this.requestURL(url);
}
