import { Actor } from "../../..";

export interface SCORMProfileConfig {
  attemptIRI?: string;
  courseIRI: string;
  courseTitle?: string;
  courseDescription?: string;
  endpoint: string;
  auth?: string;
  lessonIRI: string;
  lessonTitle?: string;
  lessonDescription?: string;
  entry?: "ab-initio" | "resume";
  actor: Actor;
}
