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
- [Statement API](#Statement-API)
  - [sendStatement](#sendStatement)
  - [getStatement](#getStatement)
  - [getStatements](#getStatements)
  - [getMoreStatements](#getMoreStatements)
  - [voidStatement](#voidStatement)
  - [getVoidedStatement](#getVoidedStatement)
- [Activity State API](#Activity-State-API)
  - [createActivityState](#createActivityState)
  - [setActivityState](#setActivityState)
  - [getActivityStates](#getActivityStates)
  - [getActivityState](#getActivityState)
  - [deleteActivityState](#deleteActivityState)
- [Activity Profile API](#Activity-Profile-API)
  - [createActivityProfile](#createActivityProfile)
  - [setActivityProfile](#setActivityProfile)
  - [getActivityProfiles](#getActivityProfiles)
  - [getActivityProfile](#getActivityProfile)
  - [deleteActivityProfile](#deleteActivityProfile)

## XAPI

### new XAPI()

To use any of the APIs, you will need to create a new instance of [XAPI](./XAPI.ts) with your LRS credentials.

```ts
const endpoint = "https://my-lms.com/endpoint/";
const auth = `Basic ${btoa('username:password')}`;
const xapi = new XAPI(endpoint, auth);
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|endpoint|string|true|The URL of your LRS endpoint.|
|auth|string|false|The `Authorization` header value to be appended to all requests.|

#### Returns

This returns an [XAPI](./XAPI.ts) object which you can use to communicate with the LRS.

## Statement API

### sendStatement

Sends a statement to the LRS.

```ts
const myStatement: Statement = { ... };
xapi.sendStatement(myStatement);
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|statement|[Statement](./interfaces/Statement/Statement.ts)|true|The statement you wish to send to the LRS.|

#### Returns

This method returns a `Promise` with the success containing a string array of statement IDs if successful, or if unsuccessful the rejection contains an error message.

### getStatement

To receive a single statement, you must use the `getStatement` method and pass the statement ID in the query. Optionally, you can provide additional parameters to the query to change the data format returned from the LRS.

```ts
xapi.getStatement({
  statementId: "abcdefgh-1234"
}).then((statement: Statement) => {
  // do stuff with `statement`
});
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|query|[GetStatementQuery](./interfaces/XAPI/GetStatementQuery.ts)|true|An object containing the statement query. Must contain the `statementId`.|

#### Returns

This method returns a `Promise` containing the [Statement](./interfaces/Statement/Statement.ts) of the supplied `statementId`.

### getStatements

To receive an array of statements based upon a query, you must use the `getStatements` method. See the [GetStatementsQuery](./interfaces/XAPI/GetStatementsQuery.ts) interface for a full list of ways to create your query.

```ts
const query: GetStatementsQuery = { ... };
xapi.getStatements(query).then((response: StatementsResponse) => {
  // do stuff with `response.statements`
});
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|query|[GetStatementsQuery](./interfaces/XAPI/GetStatementsQuery.ts)|true|An object containing the statements query.|

#### Returns

This method returns a `Promise` containing a [StatementsResponse](./interfaces/XAPI/StatementsResponse.ts) object.

### getMoreStatements

To be used in conjunction with `getStatements`. If the `more` property is populated on your initial request, more data is available. Send the value of the `more` property to this method to get the next page of statements.

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

|Parameter|Type|Requred|Description|
|-|-|-|-|
|more|string|true|The `more` property passed from the `getStatements`/`getMoreStatements` query response.|

#### Returns

This method returns a `Promise` containing a [StatementsResponse](./interfaces/XAPI/StatementsResponse.ts) object.

### voidStatement

Voids a statement in the LRS by the supplied Actor.

```ts
const actor: Actor = { ... };
xapi.voidStatement(actor, "abcdefgh-1234"});
```

##### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|actor|[Actor](./interfaces/Statement/Actor/Actor.ts)|true|The Actor who is voiding the statement e.g. an administrator.|
|statementId|string|true|The statement to be voided.|

#### Returns

This method returns a `Promise` containing an array of statement ID strings of the void statement.

### getVoidedStatement

To receive a single voided statement, you must use the `getVoidedStatement` method and pass the original statement ID in the query (not the original statement's void statement id). Optionally, you can provide additional parameters to the query to change the data format returned from the LRS.

```ts
xapi.getVoidedStatement({statementId: "abcdefgh-1234"}).then((voidStatement: Statement) => {
  // do stuff with `voidStatement`
});
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|query|[GetVoidedStatementQuery](./interfaces/XAPI/GetStatementQuery.ts)|true|An object containing the statement query. Must contain the `voidedStatementId`.|

#### Returns

This method returns a `Promise` containing the [Statement](./interfaces/Statement/Statement.ts) of the supplied `voidedStatementId`.

## Activity State API

### createActivityState

Creates or merges into an activity state document by the agent, activity identifier and activity state identifier.

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

xapi.createActivityState(agent, activityId, stateId, state);
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Agent/Agent.ts)|true|The agent performing the activity.|
|activityId|string|true|The URI of the activity.|
|stateId|string|true|The URI of the activity state to be created or merged into.|
|state|any|true|The state data to be stored.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### setActivityState

Creates or overwrites an activity state document by the agent, activity identifier and activity state identifier.

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

xapi.setActivityState(agent, activityId, stateId, state);
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Agent/Agent.ts)|true|The agent performing the activity.|
|activityId|string|true|The URI of the activity.|
|stateId|string|true|The URI of the activity state to be created or overwritten.|
|state|any|true|The state data to be stored.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### getActivityStates

Gets an array of activity state identifiers by the agent and activity identifier.

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const activityId: string = "https://example.com/activities/test-activity";

xapi.getActivityStates(agent, activityId).then((states: string[]) => {
  console.log(states); // ["https://example.com/activities/test-activity/states/myStateId"]
});
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Agent/Agent.ts)|true|The agent performing the activity.|
|activityId|string|true|The URI of the activity.|

#### Returns

This method returns a `Promise` resolving with an array of activity state identifiers if successful.

### getActivityState

Gets an activity state document by the agent, activity identifier and the activity state identifier.

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const activityId: string = "https://example.com/activities/test-activity";
const stateId: string = activityId + "/states/myStateId"

xapi.getActivityState(agent, activityId, stateId).then((state) => {
  // do stuff with state
});
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Agent/Agent.ts)|true|The agent performing the activity.|
|activityId|string|true|The URI of the activity.|
|stateId|string|true|The URI of the state to be retrieved.|

#### Returns

This method returns a `Promise` resolving with the stored document if successful.

### deleteActivityState

Deletes an activity state document by the agent, activity identifier and the activity state identifier.

```ts
const agent: Agent = {
  objectType: "Agent",
  name: "Test Agent",
  mbox: "mailto:test@agent.com"
};
const activityId: string = "https://example.com/activities/test-activity";
const stateId: string = activityId + "/states/myStateId"

xapi.deleteActivityState(agent, activityId, stateId);
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|agent|[Agent](./interfaces/Statement/Agent/Agent.ts)|true|The agent performing the activity.|
|activityId|string|true|The URI of the activity.|
|stateId|string|true|The URI of the state to be deleted.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

## Activity Profile API

### createActivityProfile

Creates or merges into an activity profile document by the activity identifier and activity profile identifier.

```ts
const activityId: string = "https://example.com/activities/test-activity";
const profileId: string = activityId + "/profiles/myProfileId"
const profile = {
  myKey: "myValue"
}

xapi.createActivityProfile(activityId, profileId, profile);
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|
|profileId|string|true|The URI of the activity profile to be created or merged into.|
|profile|any|true|The profile data to be stored.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### setActivityProfile

Creates or overwrites an activity profile document by the activity identifier and activity profile identifier.

```ts
const activityId: string = "https://example.com/activities/test-activity";
const profileId: string = activityId + "/profiles/myProfileId"
const profile = {
  myKey: "myValue"
}

xapi.setActivityProfile(activityId, profileId, profile);
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|
|profileId|string|true|The URI of the activity profile to be created or overwritten.|
|profile|any|true|The profile data to be stored.|

#### Returns

This method returns a `Promise` resolving with no data if successful.

### getActivityProfiles

Gets an array of activity profile identifiers by the activity identifier.

```ts
const activityId: string = "https://example.com/activities/test-activity";

xapi.getActivityProfiles(activityId).then((profiles: string[]) => {
  console.log(profiles); // ["https://example.com/activities/test-activity/profiles/myProfileId"]
});
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|

#### Returns

This method returns a `Promise` resolving with an array of activity profile identifiers if successful.

### getActivityProfile

Gets an activity profile document by the activity identifier and the activity profile identifier.

```ts
const activityId: string = "https://example.com/activities/test-activity";
const profileId: string = activityId + "/profiles/myProfileId"

xapi.getActivityProfile(activityId, profileId).then((profile) => {
  // do stuff with profile
});
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|
|profileId|string|true|The URI of the profile to be retrieved.|

#### Returns

This method returns a `Promise` resolving with the stored document if successful.

### deleteActivityProfile

Deletes an activity profile document by the activity identifier and the activity state identifier.

```ts
const activityId: string = "https://example.com/activities/test-activity";
const profileId: string = activityId + "/profiles/myProfileId"

xapi.deleteActivityProfile(activityId, profileId);
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|activityId|string|true|The URI of the activity.|
|profileId|string|true|The URI of the profile to be deleted.|

#### Returns

This method returns a `Promise` resolving with no data if successful.
