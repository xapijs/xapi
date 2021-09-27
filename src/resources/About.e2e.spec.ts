import XAPI from "../XAPI";

const credentials: {
  endpoint: string;
  username: string;
  password: string;
}[] = JSON.parse(process.env.LRS_CREDENTIALS_ARRAY);

credentials.forEach((credential) => {
  const endpoint: string = credential.endpoint || "";
  const username: string = credential.username || "";
  const password: string = credential.password || "";
  const auth: string = XAPI.toBasicAuth(username, password);
  const xapi: XAPI = new XAPI(endpoint, auth);

  describe("about resource", () => {
    test("can get about", () => {
      return xapi.getAbout().then((result) => {
        return expect(result.data).toEqual(
          expect.objectContaining({
            version: expect.any(Array),
          })
        );
      });
    });
  });
});
