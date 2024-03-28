import { AdapterPromise } from "../../../adapters";
import { Verbs } from "../../../constants";
import XAPI from "../../../XAPI";
import { Statement } from "..";
import { VoidStatementsParams } from "./VoidStatementsParams";

export function voidStatements(
  this: XAPI,
  params: VoidStatementsParams
): AdapterPromise<string[]> {
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
