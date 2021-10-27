import XAPI from "../../../XAPI";
import axios from "axios";
import {
  testAgent,
  testEndpoint,
  testStatement,
} from "../../../../test/constants";
import { Resources, Verbs } from "../../../constants";
import { Statement } from "..";

jest.mock("axios");

describe("statement resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can void a statement", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.voidStatement({
      actor: testAgent,
      statementId: testStatement.id,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
