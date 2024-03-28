import XAPI from "../../../XAPI";
import { testActivity, testEndpoint } from "../../../../test/constants";
import { Resources } from "../../../constants";

describe("activities resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get activity", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getActivity({
      activityId: testActivity.id,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${
          Resources.ACTIVITIES
        }?activityId=${encodeURIComponent(testActivity.id)}`,
      })
    );
  });

  test("can get activity with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getActivity({
      activityId: testActivity.id,
      useCacheBuster: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${
            Resources.ACTIVITIES
          }?activityId=${encodeURIComponent(testActivity.id)}&cachebuster=`
        ),
      })
    );
  });
});
