import { SCORMProfile } from "./SCORMProfile";
import { SCORMProfileConfig } from "./Interfaces/SCORMProfileConfig";
import { getSearchQueryParamsAsObject } from "../../lib/getSearchQueryParamsAsObject";
// import { uuidv4 } from "../../lib/uuidv4";

// WIP
export class SCORMProfileAuto extends SCORMProfile {
  constructor(outOfBandConfiguration?: SCORMProfileConfig) {
    let config: SCORMProfileConfig | undefined = undefined;
    // Get Web-Based Activities launch parameters
    const queryParamConfig: SCORMProfileConfig = getSearchQueryParamsAsObject(window.location.href) as SCORMProfileConfig;
    // Use found query param config OR
    // default to Out-of-Band configuration
    if (Object.keys(queryParamConfig).length > 0) {
      config = queryParamConfig;
    } else if (outOfBandConfiguration) {
      config = outOfBandConfiguration;
    }
    // Fail if we do not have a configuration
    if (config === undefined) {
      throw new Error("No xAPI configuration found");
    }

    // TODO: Attempt IRIs
    // Get attempts array
      // If array exists
        // if IRI does not exist in array already
          // add IRI on to existing array
          // Put array to activity state document
      // If array does not exist
        // create new array with IRI in
        // Post array to activity state document

    // if (!config.attemptIRI) {
    //   config.attemptIRI = uuidv4();
    // }

    super(config);

    // Auto-initialise/resume
    if (config.entry === "ab-initio") {
      this.abInitio();
    } else if (config.entry === "resume") {
      this.resume();
    }
  }
}
