import { XAPI, Agent, Statement, Activity, Attachment, AttachmentUsage } from ".";
import * as CryptoJS from "crypto-js";

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
    id: "https://github.com/CookieCookson/xAPI-JS/XAPI"
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



function arrayBufferToWordArray(ab: ArrayBuffer): any {
    const i8a = new Uint8Array(ab);
    const a = [];
    for (let i = 0; i < i8a.length; i += 4) {
        a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
    }
    return CryptoJS.lib.WordArray.create(a, i8a.length);
}

describe("statement api", () => {
    test("can create a statement", () => {
        return expect(xapi.sendStatement(testStatement)).resolves.toHaveLength(1);
    });

    test("can create a statement with a remote attachment", () => {
        const statement: Statement = Object.assign({}, testStatement);
        const imageURL: string = "https://raw.githubusercontent.com/RusticiSoftware/TinCanJS/8733f14ddcaeea77a0579505300bc8f38921a6b1/test/files/image.jpg";
        return fetch(imageURL).then((image) => {
            return image.arrayBuffer();
        }).then((imageAsArrayBuffer) => {
            const attachment: Attachment = {
                usageType: AttachmentUsage.SUPPORTING_MEDIA,
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
            return expect(result).toHaveLength(1);
        });
    });

    test("can create a statement with an embedded attachment", () => {
        const statement: Statement = Object.assign({}, testStatement);
        const imageURL: string = "https://raw.githubusercontent.com/RusticiSoftware/TinCanJS/8733f14ddcaeea77a0579505300bc8f38921a6b1/test/files/image.jpg";
        return fetch(imageURL).then((image) => {
            return image.arrayBuffer();
        }).then((imageAsArrayBuffer) => {
            const attachment: Attachment = {
                usageType: AttachmentUsage.SUPPORTING_MEDIA,
                display: {
                    "en-US": "Image Attachment"
                },
                description: {
                    "en-US": "One does not simply send an attachment with JavaScript"
                },
                contentType: "image/jpeg",
                length: imageAsArrayBuffer.byteLength,
                sha2: CryptoJS.SHA256(arrayBufferToWordArray(imageAsArrayBuffer)).toString()
            };
            statement.attachments = [attachment];
            return xapi.sendStatement(statement, [imageAsArrayBuffer]);
        }).then((result) => {
            return expect(result).toHaveLength(1);
        });
    });

    test("can get a single statement", () => {
        return xapi.sendStatement(testStatement).then((result) => {
            return xapi.getStatement({
                statementId: result[0]
            });
        }).then((statement) => {
            return expect(statement).toHaveProperty("id");
        });
    });

    test("can get a statement with an embedded attachment", () => {
        const statement: Statement = Object.assign({}, testStatement);
        const imageURL: string = "https://raw.githubusercontent.com/RusticiSoftware/TinCanJS/8733f14ddcaeea77a0579505300bc8f38921a6b1/test/files/image.jpg";
        return fetch(imageURL).then((image) => {
           return image.arrayBuffer();
        }).then((imageAsArrayBuffer) => {
            const attachment: Attachment = {
                usageType: AttachmentUsage.SUPPORTING_MEDIA,
                display: {
                    "en-US": "Image Attachment"
                },
                description: {
                    "en-US": "One does not simply send an attachment with JavaScript"
                },
                contentType: "image/jpeg",
                length: imageAsArrayBuffer.byteLength,
                sha2: CryptoJS.SHA256(arrayBufferToWordArray(imageAsArrayBuffer)).toString()
            };
            statement.attachments = [attachment];
            return xapi.sendStatement(statement, [imageAsArrayBuffer]);
        }).then((result) => {
            return xapi.getStatement({
                statementId: result[0],
                attachments: true
            });
        }).then((parts) => {
            const statement: Statement = parts[0];
            const attachmentData: string = parts[1];
            const blob = new Blob([attachmentData], {type: statement.attachments[0].contentType});
            const fr = new FileReader();
            // TODO: Change multiPart so the image successfully embeds and restores
            return new Promise((resolve, reject) => {
                fr.onloadend = (e) => {
                    resolve(e.target.result);
                };
                fr.onerror = (e) => reject(e);
                fr.readAsDataURL(blob);
            });
        }).then((base64Image: string) => {
            console.log(base64Image);
            // return expect(attachmentData.byteLength).toEqual(statement.attachments[0].length);
            // return expect(CryptoJS.SHA256(arrayBufferToWordArray(attachmentData)).toString()).toEqual(statement.attachments[0].sha2);
        });
    });

    test("can void a single statement", () => {
        return xapi.sendStatement(testStatement).then((result) => {
            return xapi.voidStatement(testAgent, result[0]);
        }).then((voidResult) => {
            return expect(voidResult).toHaveLength(1);
        });
    });

    test("can get a voided statement", () => {
        let statementId: string;
        return xapi.sendStatement(testStatement).then((result) => {
            statementId = result[0];
            return xapi.voidStatement(testAgent, statementId);
        }).then(() => {
            return xapi.getVoidedStatement({
                voidedStatementId: statementId
            });
        }).then((voidedStatement) => {
            return expect(voidedStatement).toHaveProperty("id");
        });
    });

    test("can get an array of statements", () => {
        return xapi.getStatements().then((result) => {
            return expect(result.statements).toBeTruthy();
        });
    });

    test("can query a single statement using the limit property", () => {
        return xapi.getStatements({
            limit: 1
        }).then((result) => {
            return expect(result.statements).toHaveLength(1);
        });
    });

    test("can get more statements using the more property", () => {
        return xapi.getStatements({
            limit: 1
        }).then((result) => {
            return xapi.getMoreStatements(result.more);
        }).then((result) => {
            return expect(result.statements).toBeTruthy();
        });
    });
});

describe("activity state api", () => {
    const testStateId: string = `${testActivity.id}/states/test`;
    const testState: {[key: string]: any} = {
        test: "test"
    };

    test("can create activity state", () => {
        return expect(xapi.createActivityState(testAgent, testActivity.id, testStateId, testState)).resolves.toBeDefined();
    });

    test("can set activity state", () => {
        return expect(xapi.setActivityState(testAgent, testActivity.id, testStateId, testState)).resolves.toBeDefined();
    });

    test("can get all activity states", () => {
        return expect(xapi.getActivityStates(testAgent, testActivity.id)).resolves.toHaveLength(1);
    });

    test("can get an activity state", () => {
        return expect(xapi.getActivityState(testAgent, testActivity.id, testStateId)).resolves.toMatchObject(testState);
    });

    test("can delete an activity state", () => {
        return expect(xapi.deleteActivityState(testAgent, testActivity.id, testStateId)).resolves.toBeDefined();
    });
});

describe("activity profile api", () => {
    const testProfileId: string = `${testActivity.id}/profiles/test`;
    const testProfile: {[key: string]: any} = {
        test: "test"
    };

    test("can create activity profile", () => {
        return expect(xapi.createActivityProfile(testActivity.id, testProfileId, testProfile)).resolves.toBeDefined();
    });

    test("can set activity profile", () => {
        return expect(xapi.setActivityProfile(testActivity.id, testProfileId, testProfile)).resolves.toBeDefined();
    });

    test("can get all activity profiles", () => {
        return expect(xapi.getActivityProfiles(testActivity.id)).resolves.toHaveLength(1);
    });

    test("can get an activity profile", () => {
        return expect(xapi.getActivityProfile(testActivity.id, testProfileId)).resolves.toMatchObject(testProfile);
    });

    test("can delete an activity profile", () => {
        return expect(xapi.deleteActivityProfile(testActivity.id, testProfileId)).resolves.toBeDefined();
    });
});

describe("agent profile api", () => {
    const testProfileId: string = `${testActivity.id}/profiles/test`;
    const testProfile: {[key: string]: any} = {
        test: "test"
    };

    test("can create agent profile", () => {
        return expect(xapi.createAgentProfile(testAgent, testProfileId, testProfile)).resolves.toBeDefined();
    });

    test("can set agent profile", () => {
        return expect(xapi.setAgentProfile(testAgent, testProfileId, testProfile)).resolves.toBeDefined();
    });

    test("can get all agent profiles", () => {
        return expect(xapi.getAgentProfiles(testAgent)).resolves.toHaveLength(1);
    });

    test("can get an agent profile", () => {
        return expect(xapi.getAgentProfile(testAgent, testProfileId)).resolves.toMatchObject(testProfile);
    });

    test("can delete an agent profile", () => {
        return expect(xapi.deleteAgentProfile(testAgent, testProfileId)).resolves.toBeDefined();
    });
});
