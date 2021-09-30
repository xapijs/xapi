import {
  testActivity,
  testAgent,
  testDocument,
  testStateId,
  testStateIdTextPlain,
} from "../../test/constants";
import XAPI from "../XAPI";
import { v4 as uuidv4 } from "uuid";
import { getCredentials } from "../../test/getCredentials";

getCredentials().forEach((credential) => {
  const auth: string = XAPI.toBasicAuth(
    credential.username,
    credential.password
  );
  const xapi: XAPI = new XAPI(credential.endpoint, auth);

  describe("state resource", () => {
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
        .getStates({
          agent: testAgent,
          activityId: testActivity.id,
          since: since.toISOString(),
        })
        .then((response) => {
          return expect(response.data).toEqual(
            expect.arrayContaining([expect.objectContaining({})])
          );
        });
    });

    test("can get a state", () => {
      return xapi
        .getState({
          agent: testAgent,
          activityId: testActivity.id,
          stateId: testStateId,
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

    test("can delete all states", () => {
      return xapi
        .deleteStates({
          agent: testAgent,
          activityId: testActivity.id,
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can delete all states for a registration", () => {
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
          return xapi.deleteStates({
            agent: testAgent,
            activityId: testActivity.id,
            registration: registration,
          });
        })
        .then((response) => {
          return expect(response.data).toBeDefined();
        });
    });

    test("can delete all states with an etag", () => {
      return xapi
        .getStates({
          agent: testAgent,
          activityId: testActivity.id,
        })
        .then((response) => {
          return xapi.deleteStates({
            agent: testAgent,
            activityId: testActivity.id,
            etag: response.headers.etag,
          });
        })
        .then((response) => {
          return expect(response.data).toBeDefined();
        });
    });
  });
});
