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
    describe("delete state", () => {
      test("can delete a state", () => {
        return xapi
          .deleteState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: testStateId,
          })
          .then((result) => {
            return expect(result.data).toBeDefined();
          });
      });

      test("can delete a state with a registration", () => {
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
            return xapi.deleteState({
              agent: testAgent,
              activityId: testActivity.id,
              stateId: testStateId,
              registration: registration,
            });
          })
          .then((response) => {
            return expect(response.data).toBeDefined();
          });
      });

      test("can delete a state with an etag", () => {
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
          .then((response) => {
            return xapi.deleteState({
              agent: testAgent,
              activityId: testActivity.id,
              stateId: testStateId,
              etag: response.headers.etag,
            });
          })
          .then((response) => {
            return expect(response.data).toBeDefined();
          });
      });
    });
  });
});
