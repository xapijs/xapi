import XAPI from "../../../../XAPI";
import {
  testActivity,
  testAgent,
  testEndpoint,
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

  test("can delete all states", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.deleteStates({
      agent: testAgent,
      activityId: testActivity.id,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
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
      adapter: global.adapter,
    });
    const testRegistration = "test-registration";
    await xapi.deleteStates({
      agent: testAgent,
      activityId: testActivity.id,
      registration: testRegistration,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
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
      adapter: global.adapter,
    });
    const testEtag = "my-etag";
    await xapi.deleteStates({
      agent: testAgent,
      activityId: testActivity.id,
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
        )}&activityId=${encodeURIComponent(testActivity.id)}`,
      })
    );
  });
});
