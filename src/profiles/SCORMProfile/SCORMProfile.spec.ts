import { SCORMProfile } from "./SCORMProfile";
import { SCORMProfileConfig } from "./Interfaces/SCORMProfileConfig";
import { Agent } from "../..";
import { InteractionActivityDefinition } from "./Interfaces/Interactions";
import { Verbs } from "../../constants";
import { ObjectiveActivityDefinition } from "./Interfaces/Objectives";
import { ResultScore } from "../../interfaces/Result";

const endpoint: string = process.env.LRS_ENDPOINT || "";
const username: string = process.env.LRS_USERNAME || "";
const password: string = process.env.LRS_PASSWORD || "";
const auth: string = `Basic ${btoa(username + ":" + password)}`;
const testAgent: Agent = {
  objectType: "Agent",
  name: "Jest",
  mbox: "mailto:hello@example.com"
}
const config: SCORMProfileConfig = {
  entry: "ab-initio",
  endpoint: endpoint,
  auth: auth,
  actor: testAgent,
  courseIRI: "https://github.com/CookieCookson/xAPI-JS",
  lessonIRI: "https://github.com/CookieCookson/xAPI-JS/SCORMProfile"
};
const scorm: SCORMProfile = new SCORMProfile(config);

test("can comment", () => {
  return expect(scorm.comments("Hello World")).resolves.toHaveLength(1);
});

test("can complete", () => {
  return expect(scorm.complete()).resolves.toHaveLength(1);
});

test("can initialise", () => {
  return expect(scorm.abInitio()).resolves.toHaveLength(1);
});

test("can resume", () => {
  return expect(scorm.resume()).resolves.toHaveLength(1);
});

test("can exit", () => {
  return expect(scorm.exit()).resolves.toHaveLength(1);
});

test("can suspend", () => {
  return expect(scorm.suspend()).resolves.toHaveLength(1);
});

test("can report true/false interaction", () => {
  const answer: string = "true";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "What is true?"
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "true-false",
    correctResponsesPattern: ["true"]
  };
  return expect(scorm.interaction(1, answer, definition)).resolves.toHaveLength(1);
});

test("can report choice interaction", () => {
  const answer: string = "choice1[,]choice2";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "What are the first two choices?"
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "choice",
    correctResponsesPattern: [
      "choice1[,]choice2"
    ],
    choices: [
      {
        id: "choice1",
        description: {
          "en-US": "Choice 1"
        }
      },
      {
        id: "choice2",
        description: {
          "en-US": "Choice 2"
        }
      },
      {
        id: "choice3",
        description: {
          "en-US": "Choice 3"
        }
      },
      {
        id: "choice4",
        description: {
          "en-US": "Choice 4"
        }
      }
    ]
  };
  return expect(scorm.interaction(2, answer, definition)).resolves.toHaveLength(1);
});

test("can report fill-in interaction", () => {
  const answer: string = "World";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "Hello?"
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "fill-in",
    correctResponsesPattern: [
      "World"
    ]
  };
  return expect(scorm.interaction(3, answer, definition)).resolves.toHaveLength(1);
});

test("can report long-fill-in interaction", () => {
  const answer: string = "World";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "Hello?"
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "long-fill-in",
    correctResponsesPattern: [
      "{case_matters=false}{lang=en}World"
    ]
  };
  return expect(scorm.interaction(4, answer, definition)).resolves.toHaveLength(1);
});

test("can report likert interaction", () => {
  const answer: string = "likert_4";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "What is the highest value on this likert?"
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "likert",
    correctResponsesPattern: [
      "likert_4"
    ],
    scale: [
      {
        id: "likert_0",
        description: {
          "en-US": "Very Unsatisfied"
        }
      },
      {
        id: "likert_1",
        description: {
          "en-US": "Unsatisfied"
        }
      },
      {
        id: "likert_2",
        description: {
          "en-US": "Neutral"
        }
      },
      {
        id: "likert_3",
        description: {
          "en-US": "Satisfied"
        }
      },
      {
        id: "likert_4",
        description: {
          "en-US": "Very Satisfied"
        }
      }
    ]
  };
  return expect(scorm.interaction(5, answer, definition)).resolves.toHaveLength(1);
});

test("can report matching interaction", () => {
  const answer: string = "apple[.]fruit[,]carrot[.]vegetable";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "Match the food items to their groups."
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "matching",
    correctResponsesPattern: [
      "apple[.]fruit[,]carrot[.]vegetable"
    ],
    source: [
      {
        id: "apple",
        description: {
          "en-US": "Apple"
        }
      },
      {
        id: "carrot",
        description: {
          "en-US": "Carrot"
        }
      }
    ],
    target: [
      {
        id: "fruit",
        description: {
          "en-US": "Fruit"
        }
      },
      {
        id: "vegetable",
        description: {
          "en-US": "Vegetable"
        }
      }
    ]
  };
  return expect(scorm.interaction(6, answer, definition)).resolves.toHaveLength(1);
});

test("can report performance interaction", () => {
  const answer: string = "score[.]1[,]score2[.]5";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "A set of scores"
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "performance",
    correctResponsesPattern: [
      "score[.]1:[,]score2[.]5:6"
    ],
    steps: [
      {
        id: "score",
        description: {
          "en-US": "Scores for part 1"
        }
      },
      {
        id: "score2",
        description: {
          "en-US": "Scores for part 2"
        }
      }
    ]
  };
  return expect(scorm.interaction(7, answer, definition)).resolves.toHaveLength(1);
});

test("can report sequencing interaction", () => {
  const answer: string = "one[,]two[,]three[,]four";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "Put the numbers in order:"
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "sequencing",
    correctResponsesPattern: [
      "one[,]two[,]three[,]four"
    ],
    choices: [
      {
        id: "four",
        description: {
          "en-US": "Four"
        }
      },
      {
        id: "two",
        description: {
          "en-US": "Two"
        }
      },
      {
        id: "one",
        description: {
          "en-US": "One"
        }
      },
      {
        id: "three",
        description: {
          "en-US": "Three"
        }
      }
    ]
  };
  return expect(scorm.interaction(8, answer, definition)).resolves.toHaveLength(1);
});

test("can report numeric interaction", () => {
  const answer: string = "2";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "How many legs does a human have?"
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "numeric",
    correctResponsesPattern: [
      "2"
    ]
  };
  return expect(scorm.interaction(9, answer, definition)).resolves.toHaveLength(1);
});

test("can report other interaction", () => {
  const answer: string = "(35.937432,-86.868896)";
  const definition: InteractionActivityDefinition = {
    description: {
      "en-US": "On this map, please mark Franklin, TN"
    },
    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
    interactionType: "other",
    correctResponsesPattern: [
      "(35.937432,-86.868896)"
    ]
  };
  return expect(scorm.interaction(10, answer, definition)).resolves.toHaveLength(1);
});

test("can report objective", () => {
  const definition: ObjectiveActivityDefinition = {
    name: {
      "en-US": "Test Objective"
    },
    description: {
      "en-US": "An objective used for testing purposes"
    },
    type: "http://adlnet.gov/expapi/activities/objective"
  };
  return expect(scorm.objective("test", Verbs.COMPLETED, definition)).resolves.toHaveLength(1);
});

test("can score", () => {
  let score: ResultScore = {
    scaled: 1
  };
  return expect(scorm.score(score)).resolves.toHaveLength(1);
});

test("can pass", () => {
  return expect(scorm.pass()).resolves.toHaveLength(1);
});

test("can fail", () => {
  return expect(scorm.fail()).resolves.toHaveLength(1);
});
