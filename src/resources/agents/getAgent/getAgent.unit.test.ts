import XAPI from "../../../XAPI";
import axios from "axios";
import { testAgent, testEndpoint } from "../../../../test/constants";
import { Resources } from "../../../constants";

jest.mock("axios");

describe("agent resource", () => {
  describe("get agent", () => {
    beforeEach(() => {
      (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("can get person by agent", async () => {
      const xapi = new XAPI({
        endpoint: testEndpoint,
      });
      await xapi.getAgent({
        agent: testAgent,
      });
      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: `${testEndpoint}${Resources.AGENTS}?agent=${encodeURIComponent(
            JSON.stringify(testAgent)
          )}`,
        })
      );
    });

    test("can get person by agent with cache buster", async () => {
      const xapi = new XAPI({
        endpoint: testEndpoint,
      });
      await xapi.getAgent({
        agent: testAgent,
        useCacheBuster: true,
      });
      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: expect.stringContaining(
            `${testEndpoint}${Resources.AGENTS}?agent=${encodeURIComponent(
              JSON.stringify(testAgent)
            )}&cachebuster=`
          ),
        })
      );
    });
  });
});
