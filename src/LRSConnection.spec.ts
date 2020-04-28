import { LRSConnection, Agent, Statement } from "./";
import { Activity } from "./interfaces";

const endpoint: string = process.env.LRS_ENDPOINT || "";
const username: string = process.env.LRS_USERNAME || "";
const password: string = process.env.LRS_PASSWORD || "";
const auth: string = `Basic ${btoa(username + ":" + password)}`;
const lrsConnection: LRSConnection = new LRSConnection(endpoint, auth);

const testAgent: Agent = {
    objectType: "Agent",
    name: "Jest",
    mbox: "mailto:hello@example.com"
};

const testActivity: Activity = {
    objectType: "Activity",
    id: "https://github.com/CookieCookson/xAPI-JS/LRSConnection"
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

describe("statement api", () => {
    test("can create a statement", () => {
        return expect(lrsConnection.sendStatement(testStatement)).resolves.toHaveLength(1);
    });

    test("can get a single statement", () => {
        return lrsConnection.sendStatement(testStatement).then((result) => {
            return lrsConnection.getStatement({
                statementId: result[0]
            });
        }).then((statement) => {
            return expect(statement).toHaveProperty("id");
        });
    });

    test("can void a single statement", () => {
        return lrsConnection.sendStatement(testStatement).then((result) => {
            return lrsConnection.voidStatement(testAgent, result[0]);
        }).then((voidResult) => {
            return expect(voidResult).toHaveLength(1);
        });
    });

    test("can get a voided statement", () => {
        let statementId: string;
        return lrsConnection.sendStatement(testStatement).then((result) => {
            statementId = result[0];
            return lrsConnection.voidStatement(testAgent, statementId);
        }).then(() => {
            return lrsConnection.getVoidedStatement({
                voidedStatementId: statementId
            });
        }).then((voidedStatement) => {
            return expect(voidedStatement).toHaveProperty("id");
        });
    });

    test("can get an array of statements", () => {
        return lrsConnection.getStatements().then((result) => {
            return expect(result.statements).toBeTruthy();
        });
    });

    test("can query a single statement using the limit property", () => {
        return lrsConnection.getStatements({
            limit: 1
        }).then((result) => {
            return expect(result.statements).toHaveLength(1);
        });
    });

    test("can get more statements using the more property", () => {
        return lrsConnection.getStatements({
            limit: 1
        }).then((result) => {
            return lrsConnection.getMoreStatements(result.more);
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
        return expect(lrsConnection.createActivityState(testAgent, testActivity.id, testStateId, testState)).resolves.toBeDefined();
    });

    test("can set activity state", () => {
        return expect(lrsConnection.setActivityState(testAgent, testActivity.id, testStateId, testState)).resolves.toBeDefined();
    });

    test("can get all activity states", () => {
        return expect(lrsConnection.getActivityStates(testAgent, testActivity.id)).resolves.toHaveLength(1);
    });

    test("can get an activity state", () => {
        return expect(lrsConnection.getActivityState(testAgent, testActivity.id, testStateId)).resolves.toMatchObject(testState);
    });

    test("can delete an activity state", () => {
        return expect(lrsConnection.deleteActivityState(testAgent, testActivity.id, testStateId)).resolves.toBeDefined();
    });
});

describe("activity profile api", () => {
    const testProfileId: string = `${testActivity.id}/profiles/test`;
    const testProfile: {[key: string]: any} = {
        test: "test"
    };

    test("can create activity profile", () => {
        return expect(lrsConnection.createActivityProfile(testActivity.id, testProfileId, testProfile)).resolves.toBeDefined();
    });

    test("can set activity profile", () => {
        return expect(lrsConnection.setActivityProfile(testActivity.id, testProfileId, testProfile)).resolves.toBeDefined();
    });

    test("can get all activity profiles", () => {
        return expect(lrsConnection.getActivityProfiles(testActivity.id)).resolves.toHaveLength(1);
    });

    test("can get an activity profile", () => {
        return expect(lrsConnection.getActivityProfile(testActivity.id, testProfileId)).resolves.toMatchObject(testProfile);
    });

    test("can delete an activity profile", () => {
        return expect(lrsConnection.deleteActivityProfile(testActivity.id, testProfileId)).resolves.toBeDefined();
    });
});

describe("agent profile api", () => {
    const testProfileId: string = `${testActivity.id}/profiles/test`;
    const testProfile: {[key: string]: any} = {
        test: "test"
    };

    test("can create agent profile", () => {
        return expect(lrsConnection.createAgentProfile(testAgent, testProfileId, testProfile)).resolves.toBeDefined();
    });

    test("can set agent profile", () => {
        return expect(lrsConnection.setAgentProfile(testAgent, testProfileId, testProfile)).resolves.toBeDefined();
    });

    test("can get all agent profiles", () => {
        return expect(lrsConnection.getAgentProfiles(testAgent)).resolves.toHaveLength(1);
    });

    test("can get an agent profile", () => {
        return expect(lrsConnection.getAgentProfile(testAgent, testProfileId)).resolves.toMatchObject(testProfile);
    });

    test("can delete an agent profile", () => {
        return expect(lrsConnection.deleteAgentProfile(testAgent, testProfileId)).resolves.toBeDefined();
    });
});
