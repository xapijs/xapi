import XAPI from "../../../XAPI";
import axios from "axios";
import { testEndpoint } from "../../../../test/constants";

jest.mock("axios");

describe("statement resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get more statements", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const endpoint = new URL(testEndpoint);
    const testMoreIrl = "?more=test-more-irl";
    await xapi.getMoreStatements({
      more: testMoreIrl,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${endpoint.protocol}//${endpoint.host}${testMoreIrl}`,
      })
    );
  });
});
