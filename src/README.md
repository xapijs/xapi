# Getting Started

## ES module

```bash
npm i @xapi/xapi --save
```
```ts
import XAPI, { Statement } from "@xapi/xapi";

// Create LRS connection
const endpoint = "https://my-lms.com/endpoint";
const auth = `Basic ${btoa('username:password')}`;
const xapi = new XAPI(endpoint, auth);

// Create your statement
const myStatement: Statement = { ... };

// Send your statement
xapi.sendStatement(myStatement);
```

## Browser

```html
<script src="https://unpkg.com/@xapi/xapi"></script>

<script type="text/javascript">
  // Create LRS connection
  const endpoint = "https://my-lms.com/endpoint";
  const auth = `Basic ${btoa('username:password')}`;
  const xapi = new XAPI(endpoint, auth);

  // Create your statement
  const myStatement = { ... };

  // Send your statement
  xapi.sendStatement(myStatement);
</script>
```

# Methods

- [XAPI](#XAPI)
  - [new XAPI()](#new-XAPI)

- [About Resource](#About-Resource)
  - [getAbout](#getAbout)

- [Statement Resource](#Statement-Resource)
  - [sendStatement](#sendStatement)
  - [getStatement](#getStatement)
  - [getStatements](#getStatements)
  - [getMoreStatements](#getMoreStatements)
  - [voidStatement](#voidStatement)
  - [getVoidedStatement](#getVoidedStatement)

- [State Resource](#State-Resource)
  - [createState](#createState)
  - [setState](#setState)
  - [getStates](#getStates)
  - [getState](#getState)
  - [deleteState](#deleteState)
  - [deleteStates](#deleteStates)

- [Activity Profile Resource](#Activity-Profile-Resource)
  - [createActivityProfile](#createActivityProfile)
  - [setActivityProfile](#setActivityProfile)
  - [getActivityProfiles](#getActivityProfiles)
  - [getActivityProfile](#getActivityProfile)
  - [deleteActivityProfile](#deleteActivityProfile)

- [Agent Profile Resource](#Agent-Profile-Resource)
  - [createAgentProfile](#createAgentProfile)
  - [setAgentProfile](#setAgentProfile)
  - [getAgentProfiles](#getAgentProfiles)
  - [getAgentProfile](#getAgentProfile)
  - [deleteAgentProfile](#deleteAgentProfile)

## XAPI

### new XAPI()

To use any of the Resources, you will need to create a new instance of [XAPI](./XAPI.ts) with credentials.

```ts
const endpoint = "https://my-lms.com/endpoint/";
const auth = `Basic ${btoa('username:password')}`;
const xapi = new XAPI(endpoint, auth);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|endpoint|string|true|The URL of the endpoint.|
|auth|string|false|The `Authorization` header value to be appended to all requests. Defaults to `Basic 0g==`, which is equivalent of `Basic ` followed by a base64 encoded version of the string `:`.|

#### Returns

This returns an [XAPI](./XAPI.ts) object which you can use to communicate with the LRS.

## About Resource

### getAbout

Gets information about the LRS.

#### Example

```ts
xapi.getAbout().then((about: About) => {
  console.log(about); // {versions: ["1.0.3"], extensions: []}
});
```

#### Returns

This method returns a `Promise` with the success containing an [About](./interfaces/About/About.ts) object.

## Statement Resource

### sendStatement

Sends a statement to the LRS.

#### Examples

##### Example 1: Send Basic Statement

```ts
import XAPI, { Statement } from "@xapi/xapi";

// new XAPI() etc

const myStatement: Statement = {
  actor: {
    objectType: "Agent",
    name: "Test Agent",
    mbox: "mailto:hello@example.com"
  },
  verb: {
    id: "http://example.com/verbs/tested",
    display: {
        "en-GB": "tested"
    }
  },
  object: {
    objectType: "Activity",
    id: "https://github.com/xapijs/xapi"
  }
};

xapi.sendStatement(myStatement);
```

##### Example 2: Send Embedded Attachment Statement

```ts
const attachmentContent: string = "hello world";
const arrayBuffer: ArrayBuffer = new TextEncoder().encode(attachmentContent);
const statement: Statement = {
  // actor, verb, object etc,
  attachments: [{
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
  }]
}
xapi.sendStatement(myStatement, [arrayBuffer]);
```
This example requires [CryptoJS](https://cryptojs.gitbook.io/docs/) to generate a sha2 of the attachment data.

#### Parameters

|Parameter|Type|Reqiured|Description|
|-|-|-|-|
|statement|[Statement](./interfaces/Statement/Statement.ts)|true|The statement you wish to send to the LRS.|
|attachments|ArrayBuffer[]|false|An array of attachment data converted to `ArrayBuffer`.|

#### Returns

This method returns a `Promise` with the success containing a string array of statement IDs if successful, or if unsuccessful the rejection contains an error message.

### getStatement

To receive a single statement, you must use the `getStatement` method and pass the statement ID in the query. Optionally, you can provide additional parameters to the query to change the data format returned from the LRS.

#### Examples

##### Example 1: Get Basic Statement

```ts
xapi.getStatement({
  statementId: "abcdefgh-1234"
}).then((statement: Statement) => {
  // do stuff with `statement`
});
```

##### Example 2: Get Embedded Attachment Statement

```ts
xapi.getStatement({
  statementId: "abcdefgh-1234",
  attachments: true
}).then((parts: any[]) => {
  const statement: Statement = parts[0];
  const attachment: any = parts[1];
})
```
When getting a statement with attachments, the response is returned as an array of parts. The first part always contains the statement, and the following parts are the attachments supplied with the statement.

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|query|[GetStatementQuery](./interfaces/XAPI/GetStatementQuery.ts)|true|An object containing the statement query. Must contain the `statementId`.|

#### Returns

This method returns a `Promise` containing the [Statement](./interfaces/Statement/Statement.ts) of the supplied `statementId`.

### getStatements

To receive an array of statements based upon a query, you must use the `getStatements` method. See the [GetStatementsQuery](./interfaces/XAPI/GetStatementsQuery.ts) interface for a full list of ways to create your query.

#### Example

```ts
const query: GetStatementsQuery = { ... };
xapi.getStatements(query).then((response: StatementsResponse) => {
  // do stuff with `response.statements`
});
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|query|[GetStatementsQuery](./interfaces/XAPI/GetStatementsQuery.ts)|true|An object containing the statements query.|

#### Returns

This method returns a `Promise` containing a [StatementsResponse](./interfaces/XAPI/StatementsResponse.ts) object.

### getMoreStatements

To be used in conjunction with `getStatements`. If the `more` property is populated on your initial request, more data is available. Send the value of the `more` property to this method to get the next page of statements.

#### Example

```ts
const query: GetStatementsQuery = { ... };
xapi.getStatements(query).then((response: StatementsResponse) => {
  // data
  xapi.getMoreStatements(response.more).then((response: StatementsResponse) => {
    // more data
  });
});
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|more|string|true|The `more` property passed from the `getStatements`/`getMoreStatements` query response.|

#### Returns

This method returns a `Promise` containing a [StatementsResponse](./interfaces/XAPI/StatementsResponse.ts) object.

### voidStatement

Voids a statement in the LRS by the supplied Actor.

#### Example

```ts
const actor: Actor = { ... };
xapi.voidStatement(actor, "abcdefgh-1234"});
```

##### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|actor|[Actor](./interfaces/Statement/Actor/Actor.ts)|true|The Actor who is voiding the statement e.g. an administrator.|
|statementId|string|true|The statement to be voided.|

#### Returns

This method returns a `Promise` containing an array of statement ID strings of the void statement.

### getVoidedStatement

To receive a single voided statement, you must use the `getVoidedStatement` method and pass the original statement ID in the query (not the original statement's void statement id). Optionally, you can provide additional parameters to the query to change the data format returned from the LRS.

#### Example

```ts
xapi.getVoidedStatement({statementId: "abcdefgh-1234"}).then((voidStatement: Statement) => {
  // do stuff with `voidStatement`
});
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|query|[GetVoidedStatementQuery](./interfaces/XAPI/GetStatementQuery.ts)|true|An object containing the statement query. Must contain the `voidedStatementId`.|

#### Returns

This method returns a `Promise` containing the [Statement](./interfaces/Statement/Statement.ts) of the supplied `voidedStatementId`.

## State Resource

### createState

Creates or merges into a state document by the agent, activity identifier and state identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const activityId: string = "https://example.com/activities/test-activity";
const stateId: string = activityId + "/states/myStateId"
const state = {
  myKey: "myValue"
}

xapi.createState(agent, activityId, stateId, state);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|activityId|string|true|The URI of the activity.|
|stateId|string|true|The URI of the state to be created or merged into.|
|state|any|true|The state data to be stored.|
|registration|string|false|The registration associated with this state.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### setState

Creates or overwrites a state document by the agent, activity identifier and state identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const activityId: string = "https://example.com/activities/test-activity";
const stateId: string = activityId + "/states/myStateId"
const state = {
  myKey: "myValue"
}

xapi.setState(agent, activityId, stateId, state);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|activityId|string|true|The URI of the activity.|
|stateId|string|true|The URI of the state to be created or overwritten.|
|state|any|true|The state data to be stored.|
|registration|string|false|The registration associated with this state.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### getStates

Gets an array of state identifiers by the agent and activity identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const activityId: string = "https://example.com/activities/test-activity";

xapi.getStates(agent, activityId).then((states: string[]) => {
  console.log(states); // ["https://example.com/activities/test-activity/states/myStateId"]
});
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|activityId|string|true|The URI of the activity.|
|registration|string|false|The registration associated with this state.|

#### Returns

This method returns a `Promise` resolving with an array of state identifiers if successful.

### getState

Gets a state document by the agent, activity identifier and the state identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const activityId: string = "https://example.com/activities/test-activity";
const stateId: string = activityId + "/states/myStateId"

xapi.getState(agent, activityId, stateId).then((state) => {
  // do stuff with state
});
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|activityId|string|true|The URI of the activity.|
|stateId|string|true|The URI of the state to be retrieved.|
|registration|string|false|The registration associated with this state.|

#### Returns

This method returns a `Promise` resolving with the stored document if successful.

### deleteState

Deletes a state document by the agent, activity identifier and the state identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const activityId: string = "https://example.com/activities/test-activity";
const stateId: string = activityId + "/states/myStateId"

xapi.deleteState(agent, activityId, stateId);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|activityId|string|true|The URI of the activity.|
|stateId|string|true|The URI of the state to be deleted.|
|registration|string|false|The registration associated with this stage.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### deleteStates

Deletes all state documents by the agent and activity identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const activityId: string = "https://example.com/activities/test-activity";

xapi.deleteStates(agent, activityId);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|activityId|string|true|The URI of the activity.|
|registration|string|false|The registration associated with this stage.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

## Activity Profile Resource

### createActivityProfile

Creates or merges into an activity profile document by the activity identifier and activity profile identifier.

#### Example

```ts
const activityId: string = "https://example.com/activities/test-activity";
const profileId: string = activityId + "/profiles/myProfileId"
const profile = {
  myKey: "myValue"
}

xapi.createActivityProfile(activityId, profileId, profile);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|
|profileId|string|true|The URI of the activity profile to be created or merged into.|
|profile|any|true|The profile data to be stored.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### setActivityProfile

Creates or overwrites an activity profile document by the activity identifier and activity profile identifier.

#### Example

```ts
const activityId: string = "https://example.com/activities/test-activity";
const profileId: string = activityId + "/profiles/myProfileId"
const profile = {
  myKey: "myValue"
}

xapi.setActivityProfile(activityId, profileId, profile);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|
|profileId|string|true|The URI of the activity profile to be created or overwritten.|
|profile|any|true|The profile data to be stored.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### getActivityProfiles

Gets an array of activity profile identifiers by the activity identifier.

#### Example

```ts
const activityId: string = "https://example.com/activities/test-activity";

xapi.getActivityProfiles(activityId).then((profiles: string[]) => {
  console.log(profiles); // ["https://example.com/activities/test-activity/profiles/myProfileId"]
});
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|

#### Returns

This method returns a `Promise` resolving with an array of activity profile identifiers if successful.

### getActivityProfile

Gets an activity profile document by the activity identifier and the activity profile identifier.

#### Example

```ts
const activityId: string = "https://example.com/activities/test-activity";
const profileId: string = activityId + "/profiles/myProfileId"

xapi.getActivityProfile(activityId, profileId).then((profile) => {
  // do stuff with profile
});
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|
|profileId|string|true|The URI of the profile to be retrieved.|

#### Returns

This method returns a `Promise` resolving with the stored document if successful.

### deleteActivityProfile

Deletes an activity profile document by the activity identifier and the activity profile identifier.

#### Example

```ts
const activityId: string = "https://example.com/activities/test-activity";
const profileId: string = activityId + "/profiles/myProfileId"

xapi.deleteActivityProfile(activityId, profileId);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|
|profileId|string|true|The URI of the profile to be deleted.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

## Agent Profile Resource

### createAgentProfile

Creates or merges into an agent profile document by the agent and agent profile identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const profileId: string = "https://example.com/profiles/myProfileId"
const profile = {
  myKey: "myValue"
}

xapi.createAgentProfile(agent, profileId, profile);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|profileId|string|true|The URI of the agent profile to be created or merged into.|
|profile|any|true|The profile data to be stored.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### setAgentProfile

Creates or overwrites an agent profile document by the agent and agent profile identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const profileId: string = "https://example.com/profiles/myProfileId"
const state = {
  myKey: "myValue"
}

xapi.setAgentProfile(agent, profileId, profile);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|profileId|string|true|The URI of the agent profile to be created or overwritten.|
|profile|any|true|The profile data to be stored.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### getAgentProfiles

Gets an array of agent profile identifiers by the agent.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};

xapi.getAgentProfiles(agent).then((profiles: string[]) => {
  console.log(profiles); // ["https://example.com/profiles/myProfileId"]
});
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|

#### Returns

This method returns a `Promise` resolving with an array of agent profile identifiers if successful.

### getAgentProfile

Gets an agent profile document by the agent and the agent profile identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const profileId: string = "https://example.com/profiles/myProfileId"

xapi.getAgentProfile(agent, profileId).then((profile) => {
  // do stuff with profile
});
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|profileId|string|true|The URI of the profile to be retrieved.|

#### Returns

This method returns a `Promise` resolving with the stored document if successful.

### deleteAgentProfile

Deletes an agent profile document by the agent and the agent profile identifier.

#### Example

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const profileId: string = "https://example.com/profiles/myProfileId"

xapi.deleteAgentProfile(agent, profileId);
```

#### Parameters

|Parameter|Type|Required|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Actor/Agent.ts)|true|The agent experiencing the AU.|
|profileId|string|true|The URI of the profile to be deleted.|

#### Returns

This method returns a `Promise` resolving with no data if successful.
