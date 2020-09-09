import XAPI, { Agent, Statement, Activity, Attachment } from "./XAPI";
import CryptoJS from "crypto-js";
import { TextEncoder } from "util";
import axios, { AxiosPromise } from "axios";

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
const auth: string = `Basic ${btoa(username + ":" + password)}`;
const xapi: XAPI = new XAPI(endpoint, auth);

const testAgent: Agent = {
    objectType: "Agent",
    name: "Jest",
    mbox: "mailto:hello@example.com"
};

const testActivity: Activity = {
    objectType: "Activity",
    id: "https://github.com/xapijs/xapi"
};

const testStatement: Statement = {
    actor: testAgent,
    verb: {
        id: "http://example.com/verbs/tested",
        display: {
            "en-GB": "tested"
        }
    },
    object: testActivity
};

function arrayBufferToWordArray(ab: ArrayBuffer): WordArray {
    const i8a = new Uint8Array(ab);
    const a = [];
    for (let i = 0; i < i8a.length; i += 4) {
        a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
    }
    return CryptoJS.lib.WordArray.create(a, i8a.length);
}

describe("about resource", () => {
    test("can get about", () => {
        return xapi.getAbout()
        .then((result) => {
            return expect(result.data).toEqual(expect.objectContaining({
                version: expect.any(Array)
            }));
        });
    });
});

describe("statement resource", () => {
    test("can create a statement", () => {
        return xapi.sendStatement(testStatement)
        .then((result) => {
            return expect(result.data).toHaveLength(1);
        });
    });

    test("can create a statement with a remote attachment", () => {
        const statement: Statement = Object.assign({}, testStatement);
        const imageURL: string = "https://raw.githubusercontent.com/RusticiSoftware/TinCanJS/8733f14ddcaeea77a0579505300bc8f38921a6b1/test/files/image.jpg";
        return axios.get(imageURL, {
            responseType: "arraybuffer"
        }).then((response) => {
            return response.data as ArrayBuffer;
        }).then((imageAsArrayBuffer) => {
            const attachment: Attachment = {
                usageType: XAPI.AttachmentUsages.SUPPORTING_MEDIA,
                display: {
                    "en-US": "Image Attachment"
                },
                description: {
                    "en-US": "One does not simply send an attachment with JavaScript"
                },
                contentType: "image/jpeg",
                length: imageAsArrayBuffer.byteLength,
                fileUrl: imageURL,
                sha2: CryptoJS.SHA256(arrayBufferToWordArray(imageAsArrayBuffer)).toString()
            };
            statement.attachments = [attachment];
            return xapi.sendStatement(statement);
        }).then((result) => {
            return expect(result.data).toHaveLength(1);
        });
    });

    test("can create a statement with an embedded attachment", () => {
        const statement: Statement = Object.assign({}, testStatement);
        const attachmentContent: string = "hello world";
        const arrayBuffer: ArrayBuffer = new TextEncoder().encode(attachmentContent);
        const attachment: Attachment = {
            usageType: XAPI.AttachmentUsages.SUPPORTING_MEDIA,
            display: {
                "en-US": "Text Attachment"
            },
            description: {
                "en-US": `The text attachment contains "${attachmentContent}"`
            },
            contentType: "text/plain",
            length: arrayBuffer.byteLength,
            sha2: CryptoJS.SHA256(arrayBufferToWordArray(arrayBuffer)).toString()
        };
        statement.attachments = [attachment];
        return xapi.sendStatement(statement, [arrayBuffer]).then((result) => {
            return expect(result.data).toHaveLength(1);
        });
    });

    test("can get a single statement", () => {
        return xapi.sendStatement(testStatement)
        .then((result) => {
            return xapi.getStatement({
                statementId: result.data[0]
            }) as AxiosPromise<Statement>;
        }).then((result) => {
            return expect(result.data).toHaveProperty("id");
        });
    });

    test("can get a statement with an embedded attachment", () => {
        const statement: Statement = Object.assign({}, testStatement);
        const attachmentContent: string = "hello world";
        const arrayBuffer: ArrayBuffer = new TextEncoder().encode(attachmentContent);
        const attachment: Attachment = {
            usageType: XAPI.AttachmentUsages.SUPPORTING_MEDIA,
            display: {
                "en-US": "Text Attachment"
            },
            description: {
                "en-US": `The text attachment contains "${attachmentContent}"`
            },
            contentType: "text/plain",
            length: arrayBuffer.byteLength,
            sha2: CryptoJS.SHA256(arrayBufferToWordArray(arrayBuffer)).toString()
        };
        statement.attachments = [attachment];
        return xapi.sendStatement(statement, [arrayBuffer]).then((result) => {
            return xapi.getStatement({
                statementId: result.data[0],
                attachments: true
            }) as AxiosPromise<Statement>;
        }).then((parts) => {
            const attachmentData: unknown = parts[1];
            return expect(attachmentData).toEqual(attachmentContent);
        });
    });

    test("can void a single statement", () => {
        return xapi.sendStatement(testStatement).then((result) => {
            return xapi.voidStatement(testAgent, result.data[0]);
        }).then((result) => {
            return expect(result.data).toHaveLength(1);
        });
    });

    test("can get a voided statement", () => {
        let statementId: string;
        return xapi.sendStatement(testStatement).then((result) => {
            statementId = result.data[0];
            return xapi.voidStatement(testAgent, statementId);
        }).then(() => {
            return xapi.getVoidedStatement({
                voidedStatementId: statementId
            }) as AxiosPromise<Statement>;
        }).then((result) => {
            return expect(result.data).toHaveProperty("id");
        });
    });

    test("can get an array of statements", () => {
        return xapi.getStatements().then((result) => {
            return expect(result.data.statements).toBeTruthy();
        });
    });

    test("can query for statements using the actor property", () => {
        return xapi.getStatements({
            agent: testAgent
        }).then((result) => {
            return expect(result.data.statements).toBeTruthy();
        });
    });

    test("can query a single statement using the limit property", () => {
        return xapi.getStatements({
            limit: 1
        }).then((result) => {
            return expect(result.data.statements).toHaveLength(1);
        });
    });

    test("can get more statements using the more property", () => {
        return xapi.getStatements({
            limit: 1
        }).then((result) => {
            return xapi.getMoreStatements(result.data.more);
        }).then((result) => {
            return expect(result.data.statements).toBeTruthy();
        });
    });
});

describe("state resource", () => {
    const testStateId: string = `${testActivity.id}/states/test`;
    const testState: {[key: string]: any} = {
        test: "test"
    };

    test("can create state", () => {
        return xapi.createState(testAgent, testActivity.id, testStateId, testState)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });

    test("can set state", () => {
        return xapi.setState(testAgent, testActivity.id, testStateId, testState)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });

    test("can get all states", () => {
        return xapi.getStates(testAgent, testActivity.id)
        .then((result) => {
            return expect(result.data).toHaveLength(1);
        });
    });

    test("can get a state", () => {
        return xapi.getState(testAgent, testActivity.id, testStateId)
        .then((result) => {
            return expect(result.data).toMatchObject(testState);
        });
    });

    test("can delete a state", () => {
        return xapi.deleteState(testAgent, testActivity.id, testStateId)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });

    test("can delete all states", () => {
        return xapi.deleteStates(testAgent, testActivity.id)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });
});

describe("activities resource", () => {
    test("can get activity", () => {
        return xapi.getActivity(testActivity.id)
        .then((result) => {
            return expect(result.data).toMatchObject(testActivity);
        });
    });
});

describe("activity profile resource", () => {
    const testProfileId: string = `${testActivity.id}/profiles/test`;
    const testProfile: {[key: string]: any} = {
        test: "test"
    };

    test("can create activity profile", () => {
        return xapi.createActivityProfile(testActivity.id, testProfileId, testProfile)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });

    test("can set activity profile", () => {
        return xapi.setActivityProfile(testActivity.id, testProfileId, testProfile)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });

    test("can get all activity profiles", () => {
        return xapi.getActivityProfiles(testActivity.id)
        .then((result) => {
            return expect(result.data).toHaveLength(1);
        });
    });

    test("can get an activity profile", () => {
        return xapi.getActivityProfile(testActivity.id, testProfileId)
        .then((result) => {
            return expect(result.data).toMatchObject(testProfile);
        });
    });

    test("can delete an activity profile", () => {
        return xapi.deleteActivityProfile(testActivity.id, testProfileId)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });
});

describe("agent resource", () => {
    test("can get person by agent", () => {
        return xapi.getAgent(testAgent)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });
});

describe("agent profile resource", () => {
    const testProfileId: string = `${testActivity.id}/profiles/test`;
    const testProfile: {[key: string]: any} = {
        test: "test"
    };

    test("can create agent profile", () => {
        return xapi.createAgentProfile(testAgent, testProfileId, testProfile)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });

    test("can set agent profile", () => {
        return xapi.setAgentProfile(testAgent, testProfileId, testProfile)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });

    test("can get all agent profiles", () => {
        return xapi.getAgentProfiles(testAgent)
        .then((result) => {
            return expect(result.data).toHaveLength(1);
        });
    });

    test("can get an agent profile", () => {
        return xapi.getAgentProfile(testAgent, testProfileId)
        .then((result) => {
            return expect(result.data).toMatchObject(testProfile);
        });
    });

    test("can delete an agent profile", () => {
        return xapi.deleteAgentProfile(testAgent, testProfileId)
        .then((result) => {
            return expect(result.data).toBeDefined();
        });
    });
});
