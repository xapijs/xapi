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

  getLearnerPreferences() {
    const learnerPreferences = this.cmi5.getLearnerPreferences();
    console.log(learnerPreferences);
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

  render() {
    return (
      <div>
        <header>
          <h1>XAPI JS Cmi5 Demo</h1>
        </header>

        <main>
          <button disabled={this.initialized} onClick={(): void => this.initialize()}>Initialize</button>
          <button disabled={!this.initialized} onClick={(): void => this.getLearnerPreferences()}>Get Learner Preferences</button>
          <button disabled={!this.initialized} onClick={(): void => this.complete()}>Complete</button>
          <button disabled={!this.initialized} onClick={(): void => this.pass()}>Pass</button>
          <button disabled={!this.initialized} onClick={(): void => this.fail()}>Fail</button>
          <button disabled={!this.initialized} onClick={(): void => this.terminate()}>Terminate</button>
        </main>
      </div>
    );
  }
}
