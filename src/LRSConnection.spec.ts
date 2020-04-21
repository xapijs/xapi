import { LRSConnection, Agent, Statement } from "./";

const endpoint: string = process.env.LRS_ENDPOINT || "";
const username: string = process.env.LRS_USERNAME || "";
const password: string = process.env.LRS_PASSWORD || "";
const auth: string = `Basic ${btoa(username + ":" + password)}`;
const lrsConnection: LRSConnection = new LRSConnection(endpoint, auth);

const testAgent: Agent = {
    objectType: "Agent",
    name: "Jest",
    mbox: "mailto:hello@example.com"
}

const testStatement: Statement = {
    actor: testAgent,
    verb: {
        id: "http://adlnet.gov/expapi/verbs/tested",
        display: {
            "en-GB": "tested"
        }
    },
    object: {
        objectType: "Activity",
        id: "https://github.com/CookieCookson/xAPI-JS"
    }
}

test("can create a statement", () => {
    return expect(lrsConnection.sendStatement(testStatement)).resolves.toHaveLength(1);
})

test("can get a single statement", () => {
    return lrsConnection.sendStatement(testStatement).then((result) => {
        return lrsConnection.getStatement({
            statementId: result[0]
        })
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
        statementId = result[0]
        return lrsConnection.voidStatement(testAgent, statementId);
    }).then(() => {
        return lrsConnection.getVoidedStatement({
            voidedStatementId: statementId
        });
    }).then((voidedStatement) => {
        return expect(voidedStatement).toHaveProperty("id");
    })
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