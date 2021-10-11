import { formatEndpoint } from "./formatEndpoint";

test("returns endpoint with trailing slash intact", () => {
  const endpoint = "https://cloud.scorm.com/lrs/xxxxxxxxxx/sandbox/";
  const formattedEndpoint = formatEndpoint(endpoint);
  return expect(formattedEndpoint).toEqual(endpoint);
});

test("appends trailing slash to endpoint without trailing slash", () => {
  const endpoint = "https://cloud.scorm.com/lrs/xxxxxxxxxx/sandbox";
  const formattedEndpoint = formatEndpoint(endpoint);
  return expect(formattedEndpoint).toEqual(endpoint + "/");
});
