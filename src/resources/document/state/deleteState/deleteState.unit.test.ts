import XAPI from "../../../../XAPI";
import {
  testActivity,
  testAgent,
  testEndpoint,
  testStateId,
} from "../../../../../test/constants";
import { Resources } from "../../../../constants";

describe("state resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can delete a state", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.deleteState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
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
      adapter: global.adapter,
    });
    const testRegistration = "test-registration";
    await xapi.deleteState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      registration: testRegistration,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
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
      adapter: global.adapter,
    });
    const testEtag = "my-etag";
    await xapi.deleteState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      etag: testEtag,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
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
