import { ActivityDefinition } from ".";
import { LanguageMap } from "../..";

interface BaseInteractionActivityDefinition extends ActivityDefinition {
  type: "http://adlnet.gov/expapi/activities/cmi.interaction";
  correctResponsesPattern?: string[];
}

export interface InteractionComponent {
  id: string;
  description?: LanguageMap;
}

interface TrueFalseInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "true-false";
  correctResponsesPattern?: ["true"] | ["false"];
}

interface ChoiceInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "choice";
  choices?: InteractionComponent[];
}

interface FillInInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "fill-in";
}

interface LongFillInInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "long-fill-in";
}

interface LikertInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "likert";
  scale?: InteractionComponent[];
}

interface MatchingInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "matching";
  source?: InteractionComponent[];
  target?: InteractionComponent[];
}

interface PerformanceInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "performance";
  steps?: InteractionComponent[];
}

interface SequencingInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "sequencing";
  choices?: InteractionComponent[];
}

interface NumericInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "numeric";
}

interface OtherInteractionActivityDefinition
  extends BaseInteractionActivityDefinition {
  interactionType: "other";
}

export type InteractionActivityDefinition =
  | TrueFalseInteractionActivityDefinition
  | ChoiceInteractionActivityDefinition
  | FillInInteractionActivityDefinition
  | LongFillInInteractionActivityDefinition
  | LikertInteractionActivityDefinition
  | MatchingInteractionActivityDefinition
  | PerformanceInteractionActivityDefinition
  | SequencingInteractionActivityDefinition
  | NumericInteractionActivityDefinition
  | OtherInteractionActivityDefinition;
