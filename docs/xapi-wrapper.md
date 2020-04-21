# xAPI Wrapper

## Basic Example
```ts
import { LRSConnection, Statement } from "xapi-js";

// Create LRS connection
const endpoint = "https://my-lms.com/endpoint";
const auth = `Basic ${btoa('username:password')}`;
const lrsConnection = new LRSConnection(endpoint, auth);

// Create your statement
const myStatement: Statement = { ... };

// Send your statement
lrsConnection.sendStatement(myStatement);
```

## API

### LRSConnection
___
new LRSConnection ( endpoint : string , auth ? : string ) : LRSConnection
___
To read or write data to the LRS, you will need to create an instance of `LRSConnection`.

#### Example
```ts
const endpoint = "https://my-lms.com/endpoint/";
const auth = `Basic ${btoa('username:password')}`;
const lrsConnection = new LRSConnection(endpoint, auth);
```

#### Parameters

|Parameter|Type|Requred|Description|
|-|-|-|-|
|endpoint|string|true|The URL of your LRS endpoint.|
|auth|string|false|The `Authorization` header value to be appended to all requests.|

#### Returns
This returns an `LRSConnection` object which you can use to communicate with the LRS. See the methods below for all ways you can send and receive statements.

### sendStatement
___
sendStatement ( statement : [Statement](/src/interfaces/Statement.ts) ) : Promise < string [] >
___
Sends a statement to the LRS.

#### Example
```ts
const myStatement: Statement = { ... };
lrsConnection.sendStatement(myStatement);
```

#### Parameters
|Parameter|Type|Requred|Description|
|-|-|-|-|
|statement|[Statement](/src/interfaces/Statement.ts)|true|The statement you wish to send to the LRS.|

#### Returns
This method returns a `Promise` with the success containing an array of statement ID strings if successful, or if unsuccessful the rejection contains an error message.

### getStatement
___
getStatement ( query : GetStatementQuery ) : Promise < Statement >
___
To receive a single statement, you must use the `getStatement` method and pass the statement ID in the query. Optionally, you can provide additional parameters to the query to change the data format returned from the LRS.

#### Example
```ts
lrsConnection.getStatement({statementId: "abcdefgh-1234"}).then((statement: Statement) => {
  // do stuff with `statement`
});
```

#### Parameters
|Parameter|Type|Requred|Description|
|-|-|-|-|
|query|[GetStatementQuery](/src/interfaces/GetStatementQuery.ts)|true|An object containing the statement query. Must contain the `statementId`.|

#### Returns
This method returns a `Promise` containing the [Statement](/src/interfaces/Statement.ts) of the supplied `statementId`.

### getStatements
___
getStatements ( query : [GetStatementsQuery](/src/interfaces/GetStatementsQuery.ts) ) : Promise < [StatementsResponse](/src/interfaces/StatementsResponse.ts) >
___
To receive an array of statements based upon a query, you must use the `getStatements` method. See the [GetStatementsQuery](/src/interfaces/GetStatementsQuery.ts) interface for a full list of ways to create your query.

#### Example
```ts
const query: GetStatementsQuery = { ... };
lrsConnection.getStatements(query).then((response: StatementsResponse) => {
  // do stuff with `response.statements`
});
```

#### Parameters
|Parameter|Type|Requred|Description|
|-|-|-|-|
|query|[GetStatementsQuery](/src/interfaces/GetStatementsQuery.ts)|true|An object containing the statements query.|

#### Returns
This method returns a `Promise` containing a [StatementsResponse](/src/interfaces/StatementsResponse.ts) object.

NOTE: At the moment there is no way to use the result of the `more` property.


### voidStatement
// TODO

### getVoidedStatement
// TODO
