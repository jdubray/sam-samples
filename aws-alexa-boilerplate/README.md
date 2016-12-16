# SAM Implementation of an Alexa Skill (Node.js)

## Alexa Skills Kit Documentation
The documentation for the Alexa Skills Kit is available on the [Amazon Apps and Services Developer Portal](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/).

## Sample
The sample is based on the AWS [HelloWorld](https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/helloWorld) sample. 

The handler wires the Skill's Lambda to the SAM actions. The intentHandler selects an action based on Alexa's intent.

Since Lambda's are stateless, the model is implemented as the lambda's session. Every action prepares a proposal that is presented to the model (via the present method). 

The lambda's response is built from the state function. State Representations come in two flavors: ask and tell.

Due to Alexa's architecture, next-actions need to be handled synchronously in the model (present function).

## Resources

- [SAM Pattern](http://sam.js.org)
- [Using the Alexa Skills Kit Samples (Node.js)](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/using-the-alexa-skills-kit-samples)
- [Getting Started](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide)
- [Invocation Name Guidelines](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/choosing-the-invocation-name-for-an-alexa-skill)
- [Developing an Alexa Skill as an AWS Lambda Function](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function)