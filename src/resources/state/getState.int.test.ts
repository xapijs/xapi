import { v4 as uuidv4 } from "uuid";
import {
  testAgent,
  testActivity,
  testStateId,
  testDocument,
} from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("state resource", () => {
    describe("get state", () => {
      test("can get a state", () => {
        return xapi
          .createState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: testStateId,
            state: testDocument,
          })
          .then(() => {
            return xapi.getState({
              agent: testAgent,
              activityId: testActivity.id,
              stateId: testStateId,
            });
          })
          .then((result) => {
            return expect(result.data).toMatchObject(testDocument);
          });
      });

      test("can get a state with a registration", () => {
        const registration = uuidv4();
        return xapi
          .createState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: testStateId,
            state: testDocument,
            registration: registration,
          })
          .then(() => {
            return xapi.getState({
              agent: testAgent,
              activityId: testActivity.id,
              stateId: testStateId,
              registration: registration,
            });
          })
          .then((response) => {
            return expect(response.data).toMatchObject(testDocument);
          });
      });
    });
  });
});
