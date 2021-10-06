import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, {
  GetStatementsParamsWithAttachments,
  StatementsResponseWithAttachments,
  GetStatementsParamsWithoutAttachments,
  StatementsResponse,
  GetStatementsParams,
} from "../../XAPI";

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
