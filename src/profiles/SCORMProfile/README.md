# xAPI SCORM Profile (WIP)
The benefits of using a profile is that the statements are preconstructed based off of a profile designed to match the SCORM model.

## Basic Example
This basic example is equivilant of performing `Initialise()` / `LMSInitialize()` in a SCORM 1.2 / 2004 environment:
```ts
import { SCORMProfileConfig, SCORMProfile } from "xapi-js";
const config: SCORMProfileConfig = { ... };
const scormProfile = new SCORMProfile(config);
this.scormProfile.abInitio()
```

## Docs

### Creating the SCORM Profile
To begin using the SCORM Profile, it must be constructed. By default, `SCORMProfile` will attempt to obtain the configuration parameters from the query string as provided by the launcher. If an expected parameter is missing, or there is no query string provided it will fall back to parameters supplied in the `Config` object.

```ts
import { Config, SCORMProfile } from "xapi-js";
const config: SCORMProfileConfig = {
  endpoint: "https://my-lms.com/endpoint"
};

const defaultSCORMProfile = new SCORMProfile();
const preconfiguredSCORMProfile = new SCORMProfile(config);
```

In this example, `defaultSCORMProfile` will rely on parameters passed in the query string. If no parameters are passed it will fail to communicate with the LRS.

On the other hand, `preconfiguredSCORMProfile` has a [SCORMProfileConfig](./Interfaces/SCORMProfileConfig.ts) property supplied, which acts as a base/fallback configuration. Any parameters passed in the querystring will override these values, but any values not overridden will default back to the values set in the supplied config. This is very useful if you plan on hosting a standalone module, or if you wish to provide values which the LRS may fail to supply when launching your content.

### Making Requests
// TODO