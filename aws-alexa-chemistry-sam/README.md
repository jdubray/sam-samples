# SAM Implementation of an Alexa Skill (Node.js)

## Alexa Skills Kit Documentation
The documentation for the Alexa Skills Kit is available on the [Amazon Apps and Services Developer Portal](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/).

## Sample
The sample is based on the AWS [ChemistryFlashCards](samples/ChemistryFlashCards) sample (A skill that quizzes you on chemistry with flash cards). 

The handler wires the Skill's Lambda to the SAM implementation. The entry point of the pattern is the dispatch function which selects an action based on the Alexa intent.

Since Lambda's are stateless, the model is implemented at the lambda's session. Every action prepare a proposal that is presented to the model (via the present function). 

The lambda's response is built from the state representation (render function) which is "displayed" in the Alexa response format and returned by the handler.

Due to Alexa's architecture, next-actions need to be handled synchronously in the model (present function).

## Resources

- [SAM Pattern](http://sam.js.org)
- [Using the Alexa Skills Kit Samples (Node.js)](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/using-the-alexa-skills-kit-samples)
- [Getting Started](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide)
- [Invocation Name Guidelines](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/choosing-the-invocation-name-for-an-alexa-skill)
- [Developing an Alexa Skill as an AWS Lambda Function](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function)