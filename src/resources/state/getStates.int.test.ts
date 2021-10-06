import { v4 as uuidv4 } from "uuid";
import {
  testAgent,
  testActivity,
  testDocument,
  testStateId,
} from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("state resource", () => {
    describe("get states", () => {
      test("can get all states", () => {
        return xapi
          .getStates({
            agent: testAgent,
            activityId: testActivity.id,
          })
          .then((result) => {
            return expect(result.data).toEqual(expect.any(Array));
          });
      });

      test("can get all states with a registration", () => {
        const registration = uuidv4();
        const stateId = new Date().getTime().toString();
        return xapi
          .createState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: stateId,
            state: { foo: "bar" },
            registration: registration,
          })
          .then(() => {
            return xapi.getStates({
              agent: testAgent,
              activityId: testActivity.id,
              registration: registration,
            });
          })
          .then((response) => {
            return expect(response.data).toEqual(
              expect.arrayContaining([expect.objectContaining({})])
            );
          });
      });

      test("can get all states since a certain date", () => {
        const since = new Date();
        since.setDate(since.getDate() - 1); // yesterday
        return xapi
          .createState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: testStateId,
            state: testDocument,
          })
          .then(() => {
            return xapi.getStates({
              agent: testAgent,
              activityId: testActivity.id,
              since: since.toISOString(),
            });
          })
          .then((response) => {
            return expect(response.data).toEqual(
              expect.arrayContaining([expect.objectContaining({})])
            );
          });
      });
    });
  });
});
