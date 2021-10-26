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

  test("can get a state", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
    });
    const testRegistration = "test-registration";
    await xapi.getState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      registration: testRegistration,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
    });
    await xapi.getState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      useCacheBuster: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
