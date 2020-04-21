# xAPI SCORM Profile (WIP)

## Basic Example
This basic example is equivilant of performing `Initialise()` / `LMSInitialize()` in a SCORM 1.2 / 2004 environment:
```ts
import { Config, SCORMProfile } from "xapi-js";
let config: Config = { ... };
let scormProfile = new SCORMProfile(config);
this.scormProfile.initialise()
```

## Docs

### Creating the SCORM Profile
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

### Sending the SCORM Equvilant statements to the LRS
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
