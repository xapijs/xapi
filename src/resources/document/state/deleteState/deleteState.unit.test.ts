import XAPI from "../../../../XAPI";
import axios from "axios";
import {
  testActivity,
  testAgent,
  testEndpoint,
  testStateId,
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

  test("can delete a state", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.deleteState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&stateId=${encodeURIComponent(testStateId)}`,
      })
    );
  });

  test("can delete a state with registration", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testRegistration = "test-registration";
    await xapi.deleteState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      registration: testRegistration,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&stateId=${encodeURIComponent(
          testStateId
        )}&registration=${testRegistration}`,
      })
    );
  });

  test("can delete a state with etag", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testEtag = "my-etag";
    await xapi.deleteState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
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
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&stateId=${encodeURIComponent(testStateId)}`,
      })
    );
  });
});
