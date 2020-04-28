# XAPI

## Basic Example
```ts
import { XAPI, Statement } from "xapi-js";

// Create XAPI instance
const endpoint = "https://my-lms.com/endpoint";
const auth = `Basic ${btoa('username:password')}`;
const xapi = new XAPI(endpoint, auth);

// Create your statement
const myStatement: Statement = { ... };

// Send your statement
xapi.sendStatement(myStatement);
```

## API

### XAPI
___
new [XAPI](./xapi.ts) ( endpoint : string , auth ? : string ) : [XAPI](./xapi.ts)
___
To read or write data to the LRS, you will need to create an instance of [XAPI](./xapi.ts).

#### Example
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
This returns an [XAPI](./xapi.ts) object which you can use to communicate with the LRS. See the methods below for all ways you can send and receive statements.

### sendStatement
___
sendStatement ( statement : [Statement](./interfaces/Statement/Statement.ts) ) : Promise < string [] >
___
Sends a statement to the LRS.

#### Example
```ts
const myStatement: Statement = { ... };
xapi.sendStatement(myStatement);
```

#### Parameters
|Parameter|Type|Requred|Description|
|-|-|-|-|
|statement|[Statement](./interfaces/Statement/Statement.ts)|true|The statement you wish to send to the LRS.|

#### Returns
This method returns a `Promise` with the success containing an array of statement ID strings if successful, or if unsuccessful the rejection contains an error message.

### getStatement
___
getStatement ( query : [GetStatementQuery](./interfaces/GetStatementQuery.ts) ) : Promise < [Statement](./interfaces/Statement/Statement.ts) >
___
To receive a single statement, you must use the `getStatement` method and pass the statement ID in the query. Optionally, you can provide additional parameters to the query to change the data format returned from the LRS.

#### Example
```ts
xapi.getStatement({statementId: "abcdefgh-1234"}).then((statement: Statement) => {
  // do stuff with `statement`
});
```

#### Parameters
|Parameter|Type|Requred|Description|
|-|-|-|-|
|query|[GetStatementQuery](./interfaces/GetStatementQuery.ts)|true|An object containing the statement query. Must contain the `statementId`.|

#### Returns
This method returns a `Promise` containing the [Statement](./interfaces/Statement/Statement.ts) of the supplied `statementId`.

### getStatements
___
getStatements ( query : [GetStatementsQuery](./interfaces/GetStatementsQuery.ts) ) : Promise < [StatementsResponse](./interfaces/StatementsResponse.ts) >
___
To receive an array of statements based upon a query, you must use the `getStatements` method. See the [GetStatementsQuery](./interfaces/GetStatementsQuery.ts) interface for a full list of ways to create your query.

#### Example
```ts
const query: GetStatementsQuery = { ... };
xapi.getStatements(query).then((response: StatementsResponse) => {
  // do stuff with `response.statements`
});
```

#### Parameters
|Parameter|Type|Requred|Description|
|-|-|-|-|
|query|[GetStatementsQuery](./interfaces/GetStatementsQuery.ts)|true|An object containing the statements query.|

#### Returns
This method returns a `Promise` containing a [StatementsResponse](./interfaces/StatementsResponse.ts) object.

### getMoreStatements
___
getMoreStatements ( more : string ) : Promise < [StatementsResponse](./interfaces/StatementsResponse.ts) >
___
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
|Parameter|Type|Requred|Description|
|-|-|-|-|
|more|string|true|The `more` property passed from the `getStatements`/`getMoreStatements` query response.|

#### Returns
This method returns a `Promise` containing a [StatementsResponse](./interfaces/StatementsResponse.ts) object.

### voidStatement
___
voidStatement ( actor : [Actor](./interfaces/Statement/Actor/Actor.ts) , statementId : string ) : Promise < string [] >
___
Voids a statement in the LRS by the supplied Actor.

#### Example
```ts
const actor: Actor = { ... };
xapi.voidStatement(actor, "abcdefgh-1234"});
```

#### Parameters
|Parameter|Type|Requred|Description|
|-|-|-|-|
|actor|[Actor](./interfaces/Statement/Actor/Actor.ts)|true|The Actor who is voiding the statement e.g. an administrator.|
|statementId|string|true|The statement to be voided.|

#### Returns
This method returns a `Promise` containing an array of statement ID strings of the void statement.

### getVoidedStatement
___
getVoidedStatement ( query : [GetVoidedStatementQuery](./interfaces/GetStatementQuery.ts) ) : Promise < [Statement](./interfaces/Statement/Statement.ts) >
___
To receive a single voided statement, you must use the `getVoidedStatement` method and pass the original statement ID in the query (not the original statement's void statement id). Optionally, you can provide additional parameters to the query to change the data format returned from the LRS.

#### Example
```ts
xapi.getVoidedStatement({statementId: "abcdefgh-1234"}).then((voidStatement: Statement) => {
  // do stuff with `voidStatement`
});
```

#### Parameters
|Parameter|Type|Requred|Description|
|-|-|-|-|
|query|[GetVoidedStatementQuery](./interfaces/GetStatementQuery.ts)|true|An object containing the statement query. Must contain the `voidedStatementId`.|

#### Returns
This method returns a `Promise` containing the [Statement](./interfaces/Statement/Statement.ts) of the supplied `voidedSatementId`.
