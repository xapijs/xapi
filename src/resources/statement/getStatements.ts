import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, {
  StatementsResponseWithAttachments,
  StatementsResponse,
} from "../../XAPI";
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
  return this.requestResource(Resources.STATEMENT, params);
}
