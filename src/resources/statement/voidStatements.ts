import { AxiosPromise } from "axios";
import { Verbs } from "../../constants";
import XAPI, { Actor, Statement } from "../../XAPI";

export interface VoidStatementsParams {
  actor: Actor;
  statementIds: string[];
}

export function voidStatements(
  this: XAPI,
  params: VoidStatementsParams
): AxiosPromise<string[]> {
  const voidStatements: Statement[] = params.statementIds.map((statementId) => {
    return {
      actor: params.actor,
      verb: Verbs.VOIDED,
      object: {
        objectType: "StatementRef",
        id: statementId,
      },
    };
  });
  return this.sendStatements({
    statements: voidStatements,
  });
}
