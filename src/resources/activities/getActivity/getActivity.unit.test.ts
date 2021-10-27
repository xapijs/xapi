import XAPI from "../../../XAPI";
import axios from "axios";
import { testActivity, testEndpoint } from "../../../../test/constants";
import { Resources } from "../../../constants";

jest.mock("axios");

describe("activities resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get activity", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getActivity({
      activityId: testActivity.id,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
    });
    await xapi.getActivity({
      activityId: testActivity.id,
      useCacheBuster: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
