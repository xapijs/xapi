import XAPI from "../../../XAPI";
import {
  testAgent,
  testEndpoint,
  testStatement,
  testStatementWithEmbeddedAttachments,
} from "../../../../test/constants";
import { Resources, Verbs } from "../../../constants";
import { Statement } from "..";

describe("statement resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can void multiple statements", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.voidStatements({
      actor: testAgent,
      statementIds: [testStatement.id, testStatementWithEmbeddedAttachments.id],
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `${testEndpoint}${Resources.STATEMENT}`,
        data: [
          {
            actor: testAgent,
            verb: Verbs.VOIDED,
            object: {
              objectType: "StatementRef",
              id: testStatement.id,
            },
          },
          {
            actor: testAgent,
            verb: Verbs.VOIDED,
            object: {
              objectType: "StatementRef",
              id: testStatementWithEmbeddedAttachments.id,
            },
          },
        ] as Statement[],
      })
    );
  });
});
