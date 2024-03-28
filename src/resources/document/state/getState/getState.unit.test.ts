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

  test("can get a state", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&stateId=${encodeURIComponent(testStateId)}`,
      })
    );
  });

  test("can get a state with a registration", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testRegistration = "test-registration";
    await xapi.getState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      registration: testRegistration,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
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

  test("can get a state with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      useCacheBuster: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
            JSON.stringify(testAgent)
          )}&activityId=${encodeURIComponent(
            testActivity.id
          )}&stateId=${encodeURIComponent(testStateId)}&cachebuster=`
        ),
      })
    );
  });
});
