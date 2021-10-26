import XAPI from "../../../XAPI";
import axios from "axios";
import { testEndpoint } from "../../../../test/constants";
import { Resources } from "../../../constants";

jest.mock("axios");

describe("about resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get about", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getAbout();
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.ABOUT}`,
      })
    );
  });

  test("can get about with cache buster", () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    xapi.getAbout({
      useCacheBuster: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          `${testEndpoint}${Resources.ABOUT}?cachebuster=`
        ),
      })
    );
  });
});
