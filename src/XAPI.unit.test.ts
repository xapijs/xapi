import { testEndpoint } from "../test/constants";
import XAPI from "./XAPI";
import axios from "axios";
import { toBasicAuth } from "./helpers/toBasicAuth/toBasicAuth";
import { Versions } from "./constants";

jest.mock("axios");

describe("xapi constructor", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can be constructed with an endpoint", () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    xapi.getAbout();
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: toBasicAuth("", ""),
        }),
      })
    );
  });

  test("can be constructed with an endpoint and auth", () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      auth: "test",
    });
    xapi.getAbout();
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "test",
        }),
      })
    );
  });

  test("can be constructed with an endpoint and version", () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      version: "1.0.0",
    });
    xapi.getAbout();
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Experience-API-Version": "1.0.0" as Versions,
        }),
      })
    );
  });

  test("can return the internal axios instance", () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      version: "1.0.0",
    });
    const axiosStatic = xapi.getAxios();
    expect(axiosStatic).toEqual(axios);
  });
});
