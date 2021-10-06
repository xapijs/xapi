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
    describe("create state", () => {
      test("can create state", () => {
        return xapi
          .createState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: testStateId,
            state: testDocument,
          })
          .then((result) => {
            return expect(result.data).toBeDefined();
          });
      });

      test("can create state with registration", () => {
        return xapi
          .createState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: testStateId,
            state: testDocument,
            registration: uuidv4(),
          })
          .then((response) => {
            return expect(response.data).toBeDefined();
          });
      });

      test("can add to a state using an etag", () => {
        const stateId = new Date().getTime().toString();
        return xapi
          .createState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: stateId,
            state: {
              x: "foo",
              y: "bar",
            },
          })
          .then(() => {
            return xapi.getState({
              agent: testAgent,
              activityId: testActivity.id,
              stateId: stateId,
            });
          })
          .then((response) => {
            return xapi.createState({
              agent: testAgent,
              activityId: testActivity.id,
              stateId: stateId,
              state: {
                x: "bash",
                z: "faz",
              },
              etag: response.headers.etag,
              matchHeader: "If-Match",
            });
          })
          .then(() => {
            return xapi.getState({
              agent: testAgent,
              activityId: testActivity.id,
              stateId: stateId,
            });
          })
          .then((response) => {
            return expect(response.data).toEqual({
              x: "bash",
              y: "bar",
              z: "faz",
            });
          });
      });
    });
  });
});
