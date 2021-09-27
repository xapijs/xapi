import { testActivity, testAgent } from "../../test/constants";
import XAPI from "../XAPI";
import { v4 as uuidv4 } from "uuid";

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

  describe("state resource", () => {
    const testStateId: string = `${testActivity.id}/states/test`;
    const testState: { [key: string]: any } = {
      test: "test",
    };

    test("can create state", () => {
      return xapi
        .createState(testAgent, testActivity.id, testStateId, testState)
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can create state with registration", () => {
      return xapi
        .createState(
          testAgent,
          testActivity.id,
          testStateId,
          testState,
          uuidv4()
        )
        .then((response) => {
          return expect(response.data).toBeDefined();
        });
    });

    test("can add to a state using an etag", () => {
      const stateId = new Date().getTime().toString();
      return xapi
        .createState(testAgent, testActivity.id, stateId, {
          x: "foo",
          y: "bar",
        })
        .then(() => {
          return xapi.getState(testAgent, testActivity.id, stateId);
        })
        .then((response) => {
          return xapi.createState(
            testAgent,
            testActivity.id,
            stateId,
            {
              x: "bash",
              z: "faz",
            },
            null,
            response.headers.etag,
            "If-Match"
          );
        })
        .then(() => {
          return xapi.getState(testAgent, testActivity.id, stateId);
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
        .setState(testAgent, testActivity.id, testStateId, testState)
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can set state with registration", () => {
      return xapi
        .setState(testAgent, testActivity.id, testStateId, testState, uuidv4())
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can set state with text/plain content type", () => {
      const testStateId: string = `${testActivity.id}/states/test-text-plain`;
      return xapi
        .setState(
          testAgent,
          testActivity.id,
          testStateId,
          testState.test,
          null,
          null,
          null,
          "text/plain"
        )
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can set a state using an etag", () => {
      const stateId = new Date().getTime().toString();
      return xapi
        .setState(testAgent, testActivity.id, stateId, {
          x: "foo",
          y: "bar",
        })
        .then(() => {
          return xapi.getState(testAgent, testActivity.id, stateId);
        })
        .then((response) => {
          return xapi.setState(
            testAgent,
            testActivity.id,
            stateId,
            {
              x: "bash",
              z: "faz",
            },
            null,
            response.headers.etag,
            "If-Match"
          );
        })
        .then(() => {
          return xapi.getState(testAgent, testActivity.id, stateId);
        })
        .then((response) => {
          return expect(response.data).toEqual({
            x: "bash",
            z: "faz",
          });
        });
    });

    test("can get all states", () => {
      return xapi.getStates(testAgent, testActivity.id).then((result) => {
        return expect(result.data).toEqual(expect.any(Array));
      });
    });

    test("can get all states with a registration", () => {
      const registration = uuidv4();
      const stateId = new Date().getTime().toString();
      return xapi
        .createState(
          testAgent,
          testActivity.id,
          stateId,
          { foo: "bar" },
          registration
        )
        .then(() => {
          return xapi.getStates(testAgent, testActivity.id, registration);
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
        .getStates(testAgent, testActivity.id, null, since.toISOString())
        .then((response) => {
          return expect(response.data).toEqual(
            expect.arrayContaining([expect.objectContaining({})])
          );
        });
    });

    test("can get a state", () => {
      return xapi
        .getState(testAgent, testActivity.id, testStateId)
        .then((result) => {
          return expect(result.data).toMatchObject(testState);
        });
    });

    test("can get a state with a registration", () => {
      const registration = uuidv4();
      return xapi
        .createState(
          testAgent,
          testActivity.id,
          testStateId,
          testState,
          registration
        )
        .then(() => {
          return xapi.getState(
            testAgent,
            testActivity.id,
            testStateId,
            registration
          );
        })
        .then((response) => {
          return expect(response.data).toMatchObject(testState);
        });
    });

    test("can delete a state", () => {
      return xapi
        .deleteState(testAgent, testActivity.id, testStateId)
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can delete a state with a registration", () => {
      const registration = uuidv4();
      return xapi
        .createState(
          testAgent,
          testActivity.id,
          testStateId,
          testState,
          registration
        )
        .then(() => {
          return xapi.deleteState(
            testAgent,
            testActivity.id,
            testStateId,
            registration
          );
        })
        .then((response) => {
          return expect(response.data).toBeDefined();
        });
    });

    test("can delete a state with an etag", () => {
      return xapi
        .createState(testAgent, testActivity.id, testStateId, testState)
        .then(() => {
          return xapi.getState(testAgent, testActivity.id, testStateId);
        })
        .then((response) => {
          return xapi.deleteState(
            testAgent,
            testActivity.id,
            testStateId,
            null,
            response.headers.etag
          );
        })
        .then((response) => {
          return expect(response.data).toBeDefined();
        });
    });

    test("can delete all states", () => {
      return xapi.deleteStates(testAgent, testActivity.id).then((result) => {
        return expect(result.data).toBeDefined();
      });
    });

    test("can delete all states for a registration", () => {
      const registration = uuidv4();
      return xapi
        .createState(
          testAgent,
          testActivity.id,
          testStateId,
          testState,
          registration
        )
        .then(() => {
          return xapi.deleteStates(testAgent, testActivity.id, registration);
        })
        .then((response) => {
          return expect(response.data).toBeDefined();
        });
    });

    test("can delete all states with an etag", () => {
      return xapi
        .getStates(testAgent, testActivity.id)
        .then((response) => {
          return xapi.deleteStates(
            testAgent,
            testActivity.id,
            null,
            response.headers.etag
          );
        })
        .then((response) => {
          return expect(response.data).toBeDefined();
        });
    });
  });
});
