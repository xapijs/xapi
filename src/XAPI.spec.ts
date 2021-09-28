import XAPI, { Agent, Activity } from "./XAPI";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const testAgent: Agent = {
  objectType: "Agent",
  name: "Jest",
  mbox: "mailto:hello@example.com",
};

const testActivity: Activity = {
  objectType: "Activity",
  id: "https://github.com/xapijs/xapi",
};

[
  {
    endpoint: "https://example.com/xapi",
    expectedUrlGetState: "https://example.com/xapi/activities/state",
    expectedUrlGetProfile: "https://example.com/xapi/agents/profile",
  },
  {
    endpoint: "http://other.com/exapi/",
    expectedUrlGetState: "http://other.com/exapi/activities/state",
    expectedUrlGetProfile: "http://other.com/exapi/agents/profile",
  },
].forEach((ex) => {
  describe(`resources for endpoint ${ex.endpoint}`, () => {
    let mockAxios: jest.SpyInstance<
      Promise<unknown>,
      [config: AxiosRequestConfig]
    >;
    beforeEach(() => {
      mockAxios = jest.spyOn(axios, "request");
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const xapi = new XAPI(ex.endpoint);

    // helper function mocks axios with defaults
    function _mockAxios<T extends any>(
      fakeResponse: Partial<AxiosResponse<T>> = {}
    ) {
      mockAxios.mockImplementation((config?: AxiosRequestConfig) => {
        return Promise.resolve({
          data: fakeResponse.data || ({} as T),
          status: fakeResponse.status || 200,
          statusText: fakeResponse.statusText || "",
          headers: fakeResponse.headers || {},
          config,
        });
      });
    }
    describe("getState", () => {
      test("requests GET activities/state", async () => {
        _mockAxios();
        await xapi.getState({
          agent: testAgent,
          activityId: testActivity.id,
          stateId: "somestateid",
        });
        expect(mockAxios).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "GET",
            url: expect.stringMatching(ex.expectedUrlGetState),
          })
        );
      });
    });
    describe("getAgentProfile", () => {
      test("requests GET activities/profile", async () => {
        _mockAxios();
        await xapi.getAgentProfile({
          agent: testAgent,
          profileId: "someid",
        });
        expect(mockAxios).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "GET",
            url: expect.stringMatching(ex.expectedUrlGetProfile),
          })
        );
      });
    });
  });
});
