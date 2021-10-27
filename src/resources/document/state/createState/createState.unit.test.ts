import XAPI from "../../../../XAPI";
import axios from "axios";
import {
  testActivity,
  testAgent,
  testDocument,
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

  test("can create state", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.createState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      state: testDocument,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&stateId=${encodeURIComponent(testStateId)}`,
        data: testDocument,
      })
    );
  });

  test("can create state with registration", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testRegistration = "test-registration";
    await xapi.createState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      state: testDocument,
      registration: testRegistration,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&stateId=${encodeURIComponent(
          testStateId
        )}&registration=${testRegistration}`,
        data: testDocument,
      })
    );
  });

  test("can create state with etag and match header", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testEtag = "my-etag";
    const testMatchHeader = "If-Match";
    await xapi.createState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      state: testDocument,
      etag: testEtag,
      matchHeader: testMatchHeader,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          [testMatchHeader]: testEtag,
        }),
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&stateId=${encodeURIComponent(testStateId)}`,
        data: testDocument,
      })
    );
  });
});
