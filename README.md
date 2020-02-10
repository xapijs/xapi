# xAPI JS
## Overview
An XAPI JS library for communicating with an LRS.

## Supported API Versions
1.0.0

## Installation
```bash
npm install xapi-js
```

## Usage
This library has been developed with both opinionated and unopinionated approaches to xAPI. To construct statements manually with full control, use the [xAPI Wrapper](#xAPI-Wrapper). To send off premade statements based off a profile, use the corresponding profile. Profiles currently supported:
- [xAPI SCORM Profile (WIP)](#xAPI-SCORM-Profile-(WIP))

### xAPI Wrapper

#### Basic Example
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

#### Docs

##### Creating an LRS connection
To read or write data to the LRS, you need an instance of `LRSConnection`:
```ts
const lrsConnection = new LRSConnection(endpoint, auth);
```

`LRSConnection` accepts two parameters, `endpoint` and `auth`. The `endpoint` string is a URL of your LRS endpoint. The `auth` string is the `Authorization` header appended to all requests.

##### Creating a statement
xAPI JS is strongly-typed, which will ensure that the statements you create are valid and can assist in the construction of your statements:

```ts
import { Statement } from "xapi-js";

const myStatement: Statement = { ... };
```

Alternatively, if do not wish to write entire statements, it has been broken down into smaller interfaces for each part of a statement:

```ts
import { Agent, Statement } from "xapi-js";

const myAgent: Agent = { ... }
const myStatement: Statement = { agent: myAgent };
```

##### Sending statements
To send a statement, you must use the `sendStatement` method on the `LRSConnection` instance:

```ts
lrsConnection.sendStatement(myStatement);
```

This method returns a `Promise` with the success containing an array of statement ID strings if successful, or if unsuccessful the rejection contains an error message.

##### Getting a statement
To receive a single statement, you must use the `getStatement` method and pass the statement ID on the `LRSConnection` instance:

```ts
lrsConnection.getStatement("abcdefgh-1234").then((statement: Statement) => {
  // do stuff with `statement`
});
```

##### WIP: Getting multiple statements
To receive an array of statements, you must use the `getStatements` method on the `LRSConnection` instance:

```ts
lrsConnection.getStatements().then((statements: Statement[]) => {
  // do stuff with `statements`
});
```

At the moment this library is limited to querying without a filter for multiple statements.

### xAPI SCORM Profile (WIP)

#### Basic Example
This basic example is equivilant of performing `Initialise()` / `LMSInitialize()` in a SCORM 1.2 / 2004 environment:
```ts
import { Config, SCORMProfile } from "xapi-js";
let config: Config = { ... };
let scormProfile = new SCORMProfile(config);
this.scormProfile.initialise()
```

#### Docs

##### Creating the SCORM Profile
To begin using the SCORM Profile, it must be constructed. By default, `SCORMProfile` will attempt to obtain the configuration parameters from the query string as provided by the launcher. If an expected parameter is missing, or there is no query string provided it will fall back to parameters supplied in the `Config` object.

```ts
import { Config, SCORMProfile } from "xapi-js";
let config: Config = {
  endpoint: "https://my-lms.com/endpoint",
};

let defaultSCORMProfile = new SCORMProfile();
let preconfiguredSCORMProfile = new SCORMProfile(config);
```

In this example, `defaultSCORMProfile` will rely on parameters passed in the query string. If no parameters are passed it will fail to communicate with the LRS.

On the other hand, `preconfiguredSCORMProfile` has a `Config` property supplied, which acts as a base/fallback configuration. Any parameters passed in the querystring will override these values, but any values not overridden will default back to the values set in the supplied config. This is very useful if you plan on hosting a standalone module, or if you wish to provide values which the LRS may fail to supply when launching your content.

##### Sending the SCORM Equvilant statements to the LRS
The benefits of using a profile is that the statements are preconstructed based off of a profile designed to match the SCORM model.

|Method|xAPI Verb|SCORM Equivalent|
|-|-|-|
|initialise|initialize|Initialise(), LMSInitialize()|

At the moment only the `initialise` method is supported, but there are plans to support:
- terminate
- cmi.exit=suspend
- cmi.entry=resume
- cmi.success_status=passed
- cmi.success_status=failed
- cmi.scored.scaled
- cmi.completion_status=completed
- cmi.interactions.n.learner_response
