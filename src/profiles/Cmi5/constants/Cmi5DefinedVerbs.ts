import { Verb, Verbs } from "../../../XAPI";

// 9.3 Verbs - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#93-verbs
export class Cmi5DefinedVerbs {
  public static readonly INITIALIZED: Verb = Verbs.INITIALIZED;
  public static readonly COMPLETED: Verb = Verbs.COMPLETED;
  public static readonly PASSED: Verb = Verbs.PASSED;
  public static readonly FAILED: Verb = Verbs.FAILED;
  public static readonly TERMINATED: Verb = Verbs.TERMINATED;
}
