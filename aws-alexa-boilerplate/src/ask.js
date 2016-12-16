/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
    Copyright 2016-2017 Jean-Jacques Dubray. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 * 
 * It was refactored by Jean-Jacques Dubray to provide a SAM implementation boilerplate project 
 * SAM Pattern homepage: http://sam.js.org
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, state) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    state.ask(speechOutput, repromptText);
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.actions = {
    // register custom intent handlers
    "HelloWorldIntent": function (intent, session, state) {

        let proposal = { 
            speechOutput: "Hello World!", 
            cardTitle: "Hello World!", 
            cardContent: "Hello World!" 
        } 

        this.present(session,state,proposal)
    },

    "AMAZON.HelpIntent": function (intent, session, state) {
        let proposal = { 
            speechOutput: "You can say hello to me!", 
            repromptSpeech: "You can say hello to me!"
        } 
        this.present(session,state,proposal) ;
    }
};

HelloWorld.prototype.present = function(session, state, proposal) {

    let speechOutput = proposal.speechOutput, 
        shouldEndSession = false, 
        repromptSpeech = proposal.repromptSpeech, 
        cardTitle = proposal.cardTitle, 
        cardContent = proposal.cardContent ;
    
    let ask = repromptSpeech || false ;

    let nextAction = false ;

    // model logic


    if (nextAction) {
        // the next-action-predicate must be called synchronously due to Alexa's architecture
        

    } else {
    // complete the reactive look and invoke state's rendering
        if (ask) {
            state.ask(speechOutput,repromptSpeech,cardTitle,cardContent) ;
        } else {
            // tell
            state.tell(speechOutput,shouldEndSession,cardTitle,cardContent) ;
        }
    }
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};