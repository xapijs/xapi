import XAPI from "../../../XAPI";
import {
  testAgent,
  testEndpoint,
  testStatement,
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

  test("can void a statement", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.voidStatement({
      actor: testAgent,
      statementId: testStatement.id,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `${testEndpoint}${Resources.STATEMENT}`,
        data: {
          actor: testAgent,
          verb: Verbs.VOIDED,
          object: {
            objectType: "StatementRef",
            id: testStatement.id,
          },
        } as Statement,
      })
    );
  });
});
