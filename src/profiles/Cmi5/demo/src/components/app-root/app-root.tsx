import { Component, h, State } from "@stencil/core";
import { Cmi5 } from "xapi-js";

@Component({
  tag: "app-root",
  styleUrl: "app-root.css"
})
export class AppRoot {
  cmi5: Cmi5 = new Cmi5();
  @State() initialized: boolean = false;

  initialize() {
    this.cmi5.initialize().then(() => {
      this.initialized = true;
    });
  }

  complete() {
    this.cmi5.complete();
  }

  pass() {
    this.cmi5.pass();
  }

  fail() {
    this.cmi5.fail();
  }

  terminate() {
    this.cmi5.terminate();
  }

  getLaunchParameters() {
    const launchParameters = this.cmi5.getLaunchParameters();
    console.log(launchParameters);
  }

  getLaunchData() {
    const launchData = this.cmi5.getLaunchData();
    console.log(launchData);
  }

  getLearnerPreferences() {
    const learnerPreferences = this.cmi5.getLearnerPreferences();
    console.log(learnerPreferences);
  }

  progress(percent: number) {
    this.cmi5.progress(percent);
  }

  /**
   * TODO: Add cmi5 allowed cmi.interaction statements to demo https://xapi.com/blog/capturing-interactions-from-cmi5-launched-assessments/
   * TODO: Implement "Best Practice #16" - https://aicc.github.io/CMI-5_Spec_Current/best_practices/
   */

  render() {
    return (
      <div>
        <header>
          <h1>XAPI JS Cmi5 Demo</h1>
        </header>

        <main>
          <h2>Getters</h2>
          <button onClick={(): void => this.getLaunchParameters()}>Get Launch Parameters</button>
          <button disabled={!this.initialized} onClick={(): void => this.getLaunchData()}>Get Launch Data</button>
          <button disabled={!this.initialized} onClick={(): void => this.getLearnerPreferences()}>Get Learner Preferences</button>
          <h2>"cmi5 defined" Statements</h2>
          <button disabled={this.initialized} onClick={(): void => this.initialize()}>Initialize</button>
          <button disabled={!this.initialized} onClick={(): void => this.complete()}>Complete</button>
          <button disabled={!this.initialized} onClick={(): void => this.pass()}>Pass</button>
          <button disabled={!this.initialized} onClick={(): void => this.fail()}>Fail</button>
          <button disabled={!this.initialized} onClick={(): void => this.terminate()}>Terminate</button>
          <h2>"cmi5 allowed" Statements</h2>
          <h3>Progress</h3>
          <button disabled={!this.initialized} onClick={(): void => this.progress(25)}>Progress 25%</button>
          <button disabled={!this.initialized} onClick={(): void => this.progress(50)}>Progress 50%</button>
          <button disabled={!this.initialized} onClick={(): void => this.progress(75)}>Progress 75%</button>
        </main>
      </div>
    );
  }
}
