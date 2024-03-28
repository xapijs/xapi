import XAPI from "../../../../XAPI";
import {
  testActivity,
  testAgent,
  testDocument,
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

  test("can set state", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.setState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      state: testDocument,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&stateId=${encodeURIComponent(testStateId)}`,
        data: testDocument,
      })
    );
  });

  test("can set state with content type", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const plainTextContentType = "text/plain";
    await xapi.setState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      state: testDocument.test,
      contentType: plainTextContentType,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          "Content-Type": plainTextContentType,
        }),
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&stateId=${encodeURIComponent(testStateId)}`,
        data: testDocument.test,
      })
    );
  });

  test("can set state with registration", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testRegistration = "test-registration";
    await xapi.setState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      state: testDocument,
      registration: testRegistration,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
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

  test("can set state with etag and match header", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testEtag = "my-etag";
    const testMatchHeader = "If-Match";
    await xapi.setState({
      agent: testAgent,
      activityId: testActivity.id,
      stateId: testStateId,
      state: testDocument,
      etag: testEtag,
      matchHeader: testMatchHeader,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
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
