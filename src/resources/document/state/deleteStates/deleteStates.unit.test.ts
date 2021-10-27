import XAPI from "../../../../XAPI";
import axios from "axios";
import {
  testActivity,
  testAgent,
  testEndpoint,
} from "../../../../../test/constants";
import { Resources } from "../../../../constants";

jest.mock("axios");

describe("state resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can delete all states", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.deleteStates({
      agent: testAgent,
      activityId: testActivity.id,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(testActivity.id)}`,
      })
    );
  });

  test("can delete all state for a registration", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testRegistration = "test-registration";
    await xapi.deleteStates({
      agent: testAgent,
      activityId: testActivity.id,
      registration: testRegistration,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&registration=${testRegistration}`,
      })
    );
  });

  test("can delete all states with etag", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testEtag = "my-etag";
    await xapi.deleteStates({
      agent: testAgent,
      activityId: testActivity.id,
      etag: testEtag,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          ["If-Match"]: testEtag,
        }),
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(testActivity.id)}`,
      })
    );
  });
});
