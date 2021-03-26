import XAPI, {
  Agent,
  Statement,
  Activity,
  Attachment,
  StatementsResponse,
} from "./XAPI";
import CryptoJS from "crypto-js";
import { TextEncoder } from "util";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

interface WordArray {
  iv: string;
  salt: string;
  ciphertext: string;
  key?: string;
  toString(encoder?: Encoder): string;
}

interface Encoder {
  parse(encodedMessage: string): any;
  stringify(words: any): string;
}

const endpoint: string = process.env.LRS_ENDPOINT || "";
const username: string = process.env.LRS_USERNAME || "";
const password: string = process.env.LRS_PASSWORD || "";
const auth: string = XAPI.toBasicAuth(username, password);
const xapi: XAPI = new XAPI(endpoint, auth);

const testAgent: Agent = {
  objectType: "Agent",
  name: "Jest",
  mbox: "mailto:hello@example.com",
};

const testActivity: Activity = {
  objectType: "Activity",
  id: "https://github.com/xapijs/xapi",
};

const testStatement: Statement = {
  actor: testAgent,
  verb: {
    id: "http://example.com/verbs/tested",
    display: {
      "en-GB": "tested",
    },
  },
  object: testActivity,
};

const testAttachmentContent: string = "hello world";

const testAttachmentArrayBuffer: ArrayBuffer = new TextEncoder().encode(
  testAttachmentContent
);
const testAttachment: Attachment = {
  usageType: XAPI.AttachmentUsages.SUPPORTING_MEDIA,
  display: {
    "en-US": "Text Attachment",
  },
  description: {
    "en-US": `The text attachment contains "${testAttachmentContent}"`,
  },
  contentType: "text/plain",
  length: testAttachmentArrayBuffer.byteLength,
  sha2: CryptoJS.SHA256(
    arrayBufferToWordArray(testAttachmentArrayBuffer)
  ).toString(),
};

function arrayBufferToWordArray(ab: ArrayBuffer): WordArray {
  const i8a = new Uint8Array(ab);
  const a = [];
  for (let i = 0; i < i8a.length; i += 4) {
    a.push(
      (i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3]
    );
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
}

describe("xapi constructor", () => {
  test("can perform basic authentication challenges when no authorization process is required", () => {
    const noAuthXapi = new XAPI(endpoint);
    return noAuthXapi.getAbout().then((result) => {
      return expect(result.data).toEqual(
        expect.objectContaining({
          version: expect.any(Array),
        })
      );
    });
  });
});

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

describe("statement resource", () => {
  test("can send a statement", () => {
    return xapi.sendStatement(testStatement).then((result) => {
      return expect(result.data).toHaveLength(1);
    });
  });

  test("can send a statement with a remote attachment", () => {
    const statement: Statement = Object.assign({}, testStatement);
    const imageURL: string =
      "https://raw.githubusercontent.com/RusticiSoftware/TinCanJS/8733f14ddcaeea77a0579505300bc8f38921a6b1/test/files/image.jpg";
    return axios
      .get(imageURL, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        return response.data as ArrayBuffer;
      })
      .then((imageAsArrayBuffer) => {
        const attachment: Attachment = {
          usageType: XAPI.AttachmentUsages.SUPPORTING_MEDIA,
          display: {
            "en-US": "Image Attachment",
          },
          description: {
            "en-US": "One does not simply send an attachment with JavaScript",
          },
          contentType: "image/jpeg",
          length: imageAsArrayBuffer.byteLength,
          fileUrl: imageURL,
          sha2: CryptoJS.SHA256(
            arrayBufferToWordArray(imageAsArrayBuffer)
          ).toString(),
        };
        statement.attachments = [attachment];
        return xapi.sendStatement(statement);
      })
      .then((result) => {
        return expect(result.data).toHaveLength(1);
      });
  });

  test("can send a statement with an embedded attachment", () => {
    const statement: Statement = Object.assign({}, testStatement);

    statement.attachments = [testAttachment];
    return xapi
      .sendStatement(statement, [testAttachmentArrayBuffer])
      .then((result) => {
        return expect(result.data).toHaveLength(1);
      });
  });

  test("can send multiple statements", () => {
    return xapi
      .sendStatements([testStatement, testStatement])
      .then((result) => {
        return expect(result.data).toHaveLength(2);
      });
  });

  test("can send multiple statements with embedded attachments", () => {
    const statement: Statement = Object.assign({}, testStatement);
    statement.attachments = [testAttachment];
    return xapi
      .sendStatements(
        [statement, statement],
        [testAttachmentArrayBuffer, testAttachmentArrayBuffer]
      )
      .then((result) => {
        return expect(result.data).toHaveLength(2);
      });
  });

  test("can get a single statement", () => {
    return xapi
      .sendStatement(testStatement)
      .then((result) => {
        return xapi.getStatement({
          statementId: result.data[0],
        });
      })
      .then((result) => {
        return expect(result.data.id).toBeTruthy();
      });
  });

  test("can get a statement with an embedded attachment", () => {
    const statement: Statement = Object.assign({}, testStatement);
    statement.attachments = [testAttachment];
    return xapi
      .sendStatement(statement, [testAttachmentArrayBuffer])
      .then((result) => {
        return xapi.getStatement({
          statementId: result.data[0],
          attachments: true,
        });
      })
      .then((response) => {
        const parts = response.data;
        const attachmentData = parts[1];
        return expect(attachmentData).toEqual(testAttachmentContent);
      });
  });

  test("can void a single statement", () => {
    return xapi
      .sendStatement(testStatement)
      .then((result) => {
        return xapi.voidStatement(testAgent, result.data[0]);
      })
      .then((result) => {
        return expect(result.data).toHaveLength(1);
      });
  });

  test("can void multiple statements", () => {
    return xapi
      .sendStatements([testStatement, testStatement])
      .then((result) => {
        return xapi.voidStatements(testAgent, result.data);
      })
      .then((result) => {
        return expect(result.data).toHaveLength(2);
      });
  });

  test("can get a voided statement", () => {
    let statementId: string;
    return xapi
      .sendStatement(testStatement)
      .then((result) => {
        statementId = result.data[0];
        return xapi.voidStatement(testAgent, statementId);
      })
      .then(() => {
        return xapi.getVoidedStatement({
          voidedStatementId: statementId,
        });
      })
      .then((result) => {
        return expect(result.data).toHaveProperty("id");
      });
  });

  test("can get multiple statements", () => {
    return xapi.getStatements().then((result) => {
      return expect(result.data.statements).toBeTruthy();
    });
  });

  test("can get multiple statements with attachments", () => {
    return xapi
      .getStatements({
        attachments: true,
        limit: 2,
      })
      .then((result) => {
        const statementsResponse = result.data[0];
        return expect(statementsResponse.statements).toHaveLength(2);
      });
  });

  test("can query for statements using the actor property", () => {
    return xapi
      .getStatements({
        agent: testAgent,
      })
      .then((result) => {
        return expect(result.data.statements).toBeTruthy();
      });
  });

  test("can query a single statement using the limit property", () => {
    return xapi
      .getStatements({
        limit: 1,
      })
      .then((result) => {
        return expect(result.data.statements).toHaveLength(1);
      });
  });

  test("can get more statements using the more property", () => {
    return xapi
      .getStatements({
        limit: 1,
      })
      .then((result) => {
        return xapi.getMoreStatements(result.data.more);
      })
      .then((result) => {
        return expect(
          (result.data as StatementsResponse).statements
        ).toBeTruthy();
      });
  });
});

test("can get more statements with attachments using the more property", () => {
  return xapi
    .getStatements({
      limit: 1,
      attachments: true,
    })
    .then((result) => {
      return xapi.getMoreStatements(result.data[0].more);
    })
    .then((result) => {
      return expect(result.data[0].statements).toBeTruthy();
    });
});

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
      .createState(testAgent, testActivity.id, testStateId, testState, uuidv4())
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
      return expect(result.data).toEqual(
        expect.arrayContaining([expect.objectContaining({})])
      );
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

describe("activities resource", () => {
  test("can get activity", () => {
    return xapi.getActivity(testActivity.id).then((result) => {
      return expect(result.data).toMatchObject(testActivity);
    });
  });
});

describe("activity profile resource", () => {
  const testProfileId: string = `${testActivity.id}/profiles/test`;
  const testProfile: { [key: string]: any } = {
    test: "test",
  };

  test("can create activity profile", () => {
    return xapi
      .createActivityProfile(testActivity.id, testProfileId, testProfile)
      .then((result) => {
        return expect(result.data).toBeDefined();
      });
  });

  test("can add to an activity profile using an etag", () => {
    const profileId = uuidv4();
    return xapi
      .createActivityProfile(testActivity.id, profileId, {
        x: "foo",
        y: "bar",
      })
      .then(() => {
        return xapi.getActivityProfile(testActivity.id, profileId);
      })
      .then((response) => {
        return xapi.createActivityProfile(
          testActivity.id,
          profileId,
          {
            x: "bash",
            z: "faz",
          },
          response.headers.etag,
          "If-Match"
        );
      })
      .then(() => {
        return xapi.getActivityProfile(testActivity.id, profileId);
      })
      .then((response) => {
        return expect(response.data).toEqual({
          x: "bash",
          y: "bar",
          z: "faz",
        });
      });
  });

  test("can set activity profile", () => {
    return xapi
      .getActivityProfile(testActivity.id, testProfileId)
      .then((result) => {
        return xapi
          .setActivityProfile(
            testActivity.id,
            testProfileId,
            testProfile,
            result.headers.etag,
            "If-Match"
          )
          .then((result) => {
            return expect(result.data).toBeDefined();
          });
      });
  });

  test("can get all activity profiles", () => {
    return xapi.getActivityProfiles(testActivity.id).then((response) => {
      return expect(response.data).toEqual(
        expect.arrayContaining([expect.objectContaining({})])
      );
    });
  });

  test("can get all activity profiles since a certain date", () => {
    const since = new Date();
    since.setDate(since.getDate() - 1); // yesterday
    return xapi
      .getActivityProfiles(testActivity.id, since.toISOString())
      .then((response) => {
        return expect(response.data).toEqual(
          expect.arrayContaining([expect.objectContaining({})])
        );
      });
  });

  test("can get an activity profile", () => {
    return xapi
      .getActivityProfile(testActivity.id, testProfileId)
      .then((result) => {
        return expect(result.data).toMatchObject(testProfile);
      });
  });

  test("can delete an activity profile", () => {
    return xapi
      .deleteActivityProfile(testActivity.id, testProfileId)
      .then((result) => {
        return expect(result.data).toBeDefined();
      });
  });

  test("can delete an activity profile with an etag", () => {
    const profileId = uuidv4();
    return xapi
      .createActivityProfile(testActivity.id, profileId, testProfile)
      .then(() => {
        return xapi.getActivityProfile(testActivity.id, profileId);
      })
      .then((response) => {
        return xapi.deleteActivityProfile(
          testActivity.id,
          profileId,
          response.headers.etag
        );
      })
      .then((response) => {
        return expect(response.data).toBeDefined();
      });
  });
});

describe("agent resource", () => {
  test("can get person by agent", () => {
    return xapi.getAgent(testAgent).then((result) => {
      return expect(result.data).toBeDefined();
    });
  });
});

describe("agent profile resource", () => {
  const testProfileId: string = `${testActivity.id}/profiles/test`;
  const testProfile: { [key: string]: any } = {
    test: "test",
  };

  test("can create agent profile", () => {
    return xapi
      .createAgentProfile(testAgent, testProfileId, testProfile)
      .then((result) => {
        return expect(result.data).toBeDefined();
      });
  });

  test("can set agent profile", () => {
    return xapi
      .getAgentProfile(testAgent, testProfileId)
      .then((result) => {
        return xapi.setAgentProfile(
          testAgent,
          testProfileId,
          testProfile,
          result.headers.etag,
          "If-Match"
        );
      })
      .then((result) => {
        return expect(result.data).toBeDefined();
      });
  });

  test("can get all agent profiles", () => {
    return xapi.getAgentProfiles(testAgent).then((result) => {
      return expect(result.data).toHaveLength(1);
    });
  });

  test("can get an agent profile", () => {
    return xapi.getAgentProfile(testAgent, testProfileId).then((result) => {
      return expect(result.data).toMatchObject(testProfile);
    });
  });

  test("can delete an agent profile", () => {
    return xapi.deleteAgentProfile(testAgent, testProfileId).then((result) => {
      return expect(result.data).toBeDefined();
    });
  });
});
