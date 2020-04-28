import { XAPI, Agent, Statement, Activity } from ".";

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

describe("statement api", () => {
    test("can create a statement", () => {
        return expect(xapi.sendStatement(testStatement)).resolves.toHaveLength(1);
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
