import { v4 as uuidv4 } from "uuid";
import {
  testAgent,
  testActivity,
  testStateId,
  testDocument,
  testStateIdTextPlain,
} from "../../../../../test/constants";
import { forEachLRS } from "../../../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("state resource", () => {
    describe("set state", () => {
      test("can set state", () => {
        return xapi
          .setState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: testStateId,
            state: testDocument,
          })
          .then((result) => {
            return expect(result.data).toBeDefined();
          });
      });

      test("can set state with registration", () => {
        return xapi
          .setState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: testStateId,
            state: testDocument,
            registration: uuidv4(),
          })
          .then((result) => {
            return expect(result.data).toBeDefined();
          });
      });

      test("can set state with text/plain content type", () => {
        return xapi
          .setState({
            agent: testAgent,
            activityId: testActivity.id,
            stateId: testStateIdTextPlain,
            state: testDocument.test,
            contentType: "text/plain",
          })
          .then((result) => {
            return expect(result.data).toBeDefined();
          });
      });

      test("can set a state using an etag", () => {
        const stateId = new Date().getTime().toString();
        return xapi
          .setState({
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
            return xapi.setState({
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
              z: "faz",
            });
          });
      });
    });
  });
});
