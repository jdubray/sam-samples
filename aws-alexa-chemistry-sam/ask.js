
/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
 http://aws.amazon.com/apache2.0/
 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 This sample was modified by Jean-Jacques Dubray to show how it could be implemented with the SAM pattern

 Copyright 2016-2017 xgen.io LLC  All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
 http://aws.amazon.com/apache2.0/
 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This sample shows how to create a simple Flash Card skill. The skill
 * supports 1 player at a time, and does not support games across sessions.
 */

'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */
var questions = [
    {
        "What is A C?": [
            "actinium"
        ]
    },
    {
        "What is A L?": [
            "aluminum"
            
        ]
    },
    {
        "What is A M?": [
            "americium"
        ]
    },
    {
        "What is S B?": [
            "antimony"
        ]
    },
    {
        "What is A R?": [
            "argon"
        ]
    },
    {
        "What is A S?": [
            "arsenic"
        ]
    },
    {
        "What is A T?": [
            "astatine"
        ]
    },
    {
        "What is B A?": [
            "barium"
        ]
    },
    {
        "What is B K?": [
            "berkelium"
        ]
    },
    {
        "What is B E?": [
            "beryllium"
        ]
    },
    {
        "What is B I?": [
            "bismuth"
        ]
    },
    {
        "What is B H?": [
            "bohrium"
        ]
    },
    {
        "What is B?": [
            "boron"
        ]
    },
    {
        "What is B R ?": [
            "bromine"
        ]
    },
    {
        "What is C D ?": [
            "cadmium"
        ]
    },
    {
        "What is C A ?": [
            "calcium"
        ]
    },
    {
        "What is C F ?": [
            "californium"
        ]
    },
    {
        "What is C ?": [
            "carbon"
        ]
    },
    {
        "What is C E ?": [
            "cerium"
        ]
    },
    {
        "What is C S ?": [
            "cesium"
        ]
    },
    {
        "What is C L ?": [
            "chlorine"
        ]
    },
    {
        "What is C R ?": [
            "chromium"
        ]
    },
    {
        "What is C O ?": [
            "cobalt"
        ]
    },
    {
        "What is C U ?": [
            "copper"
        ]
    },
    {
        "What is C M?": [
            "Curium"
        ]
    },
];

const WITHOUT_CARD = null ;


// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

//     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.05aecccb3-1461-48fb-a008-822ddrt6b516") {
//         context.fail("Invalid Application ID");
//      }

        if (event.session.new) {
            initModel({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(model, stateRepresentation) {
                    context.succeed(display(model, stateRepresentation));
                });
        } else if (event.request.type === "IntentRequest") {
            dispatch(event.request,
                event.session,
                function callback(model, stateRepresentation) {
                    context.succeed(display(model, stateRepresentation));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function initModel(newSessionRequest, model) {
    console.log("New Session Started with requestId=" + newSessionRequest.requestId + ", sessionId=" + model.sessionId);

    // add any model initialization
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    actions["StartOverIntent"](
        { intent: { name: "Launch" } }, session, callback
    )
}

/**
 * Called when the user specifies an intent for this skill.
 */
function dispatch(intentRequest, session, callback) {
    console.log("dispatch requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name,

        qualifiedIntent = intentName.split('.') ;

    actions[qualifiedIntent[qualifiedIntent.length-1]](intent, session, callback) ;

}

let actions = {
    AnswerIntent(intent,session,callback) {
        let proposal = { playing: true} ;
        present(intent, proposal, session, callback);
    },

    AnswerOnlyIntent(intent,session,callback) {
        let proposal = { playing: true} ;
        present(intent, proposal, session, callback);
    },

    DontKnowIntent(intent,session,callback) {
        let proposal = {playing: true} ;
        present(intent, proposal, session, callback);
    },

    YesIntent(intent,session,callback) {
        let proposal = {} ;
        if (session.attributes && session.attributes.userPromptedToContinue) {
            proposal.repeat = true ; 
        } else {
            proposal.playing = true ;
        }
        present(intent, proposal, session, callback);
    },

    NoIntent(intent,session,callback) {
        let proposal = {} ;
        if (session.attributes && session.attributes.userPromptedToContinue) {
            proposal.finishSession = true ;
        }
        present(intent, proposal, session, callback);
    },

    StartOverIntent(intent,session,callback) {
        let proposal = { welcome: true} ;
        
        //CHANGE THIS TEXT
        proposal.speechOutput = "I will ask you " + GAME_LENGTH.toString()+ " questions, try to get as many right as you can. Just say the answer. Let's begin. " ;
        proposal.shouldEndSession = false ;

        proposal.gameQuestions = populateGameQuestions() ;
        proposal.correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT)) ; // Generate a random index for the correct answer, from 0 to 3
        proposal.roundAnswers = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex) ;

        proposal.currentQuestionIndex = 0 ;
        proposal.spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]]);
        proposal.repromptText = spokenQuestion;

        // not sure what this code does??
        var i, j;

        for (i = 0; i < ANSWER_COUNT; i++) {
            proposal.repromptText += ""
        }
        proposal.speechOutput += repromptText;
    
        present(intent, proposal, session, callback);
    },

    RepeatIntent(intent,session,callback) {
        let proposal = {repeat: true } ;
        if (!session.attributes || !session.attributes.speechOutput) {
            this.StartOverIntent(intent,session,callback) ;
        } else {
            proposal.speechOutput =  session.attributes.speechOutput ;
            proposal.repromptText = session.attributes.repromptText ;
            present(intent, proposal, session, callback);
        }
    },

    HelpIntent(intent,session,callback) {
        // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.
        let proposal = {
            help: true,
            speechOutput : "To start a new game at any time, say, start new game. To repeat the last element, say, repeat. Would you like to keep playing?",
            repromptText: "Try to get the right answer. Would you like to keep playing?",
            shouldEndSession: false
        } ;
        present(intent, proposal, session, callback);
    },

    StopIntent(intent,session,callback) {
        let proposal = { finishSession: true} ;
        present(intent, session, callback);
    },

    CancelIntent(intent,session,callback) {
        let proposal = { finishSession: true} ;
        present(intent, session, callback);
    },

} ;


/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific business logic -------

var ANSWER_COUNT = 1;
var GAME_LENGTH = 5;
// Be sure to change this for your skill.
var CARD_TITLE = "Flash Cards"; 

function populateGameQuestions() {
    var gameQuestions = [];
    var indexList = [];
    var index = questions.length;

    if (GAME_LENGTH > index){
        throw "Invalid Game Length.";
    }

    for (var i = 0; i < questions.length; i++){
        indexList.push(i);
    }

    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (var j = 0; j < GAME_LENGTH; j++){
        var rand = Math.floor(Math.random() * index);
        index -= 1;

        var temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        gameQuestions.push(indexList[index]);
    }

    return gameQuestions;
}

function populateRoundAnswers(gameQuestionIndexes, correctAnswerIndex, correctAnswerTargetLocation) {
    // Get the answers for a given question, and place the correct answer at the spot marked by the
    // correctAnswerTargetLocation variable. Note that you can have as many answers as you want but
    // only ANSWER_COUNT will be selected.
    var answers = [],
        answersCopy = questions[gameQuestionIndexes[correctAnswerIndex]][Object.keys(questions[gameQuestionIndexes[correctAnswerIndex]])[0]],
        temp, i;

    var index = answersCopy.length;

    if (index < ANSWER_COUNT){
        throw "Not enough answers for question.";
    }

    // Shuffle the answers, excluding the first element.
    for (var j = 1; j < answersCopy.length; j++){
        var rand = Math.floor(Math.random() * (index - 1)) + 1;
        index -= 1;

        var temp = answersCopy[index];
        answersCopy[index] = answersCopy[rand];
        answersCopy[rand] = temp;
    }

    // Swap the correct answer into the target location
    for (i = 0; i < ANSWER_COUNT; i++) {
        answers[i] = answersCopy[i];
    }
    temp = answers[0];
    answers[0] = answers[correctAnswerTargetLocation];
    answers[correctAnswerTargetLocation] = temp;
    return answers;
}

function present(intent, proposal, session, callback) {
    var speechOutput = "";
    var sessionAttributes = {};
    var gameInProgress = session.attributes && session.attributes.questions;
    var answerSlotValid = isAnswerSlotValid(intent);
    var userGaveUp = intent.name === "DontKnowIntent";

    // Please note that due to Alexa's architecture, the next-action predicate 
    // must be implemented synchronously

    if (session.attributes && session.attributes.userPromptedToContinue) {
        delete session.attributes.userPromptedToContinue;
    }

    if (proposal.repeat) {
        
        callback(session.attributes,
                render(WITHOUT_CARD, proposal.speechOutput, proposal.repromptText, false));
    
    } 

    if (proposal.help) {
         if (session.attributes) {
            session.attributes.userPromptedToContinue = true;
        } else {
            // In case user invokes and asks for help simultaneously.
            session.attributes = { userPromptedToContinue: true };
        }
    
        

        callback(session.attributes,
            render(WITHOUT_CARD, proposal.speechOutput, proposal.repromptText, proposal.shouldEndSession));
    }

    if (proposal.welcome) {

        sessionAttributes = {
            speechOutput: proposal.repromptText,
            repromptText: proposal.repromptText,
            currentQuestionIndex: proposal.currentQuestionIndex,
            correctAnswerIndex: proposal.correctAnswerIndex + 1,
            questions: proposal.gameQuestions,
            score: 0,
            correctAnswerText: proposal.questions[proposal.gameQuestions[proposal.currentQuestionIndex]][Object.keys(proposal.questions[proposal.gameQuestions[proposal.currentQuestionIndex]])[0]][0]
        };
        callback(sessionAttributes,
            render(CARD_TITLE, proposal.speechOutput, proposal.repromptText, proposal.shouldEndSession));
        
    }

    if (proposal.finishSession) {

        proposal.speechOutput = proposal.speechOutput || "Thanks for playing Flash Cards!" ;
        proposal.repromptText = proposal.repromptText || "" ;

        callback(session.attributes,
            render(WITHOUT_CARD, proposal.speechOutput, proposal.repromptText, true));
        
    }

    if (proposal.playing) {
        if (!gameInProgress) {
            // If the user responded with an answer but there is no game in progress, ask the user
            // if they want to start a new game. Set a flag to track that we've prompted the user.
            sessionAttributes.userPromptedToContinue = true;
            speechOutput = "There is no game in progress. Do you want to start a new game? ";
            callback(sessionAttributes,
                render(CARD_TITLE, speechOutput, speechOutput, false));
        } else if (!answerSlotValid && !userGaveUp) {
            // If the user provided answer isn't a number > 0 and < ANSWER_COUNT,
            // return an error message to the user. Remember to guide the user into providing correct values.
            var reprompt = session.attributes.speechOutput;
            var speechOutput = "Sorry, your answer is not is our list. " + reprompt;
            callback(session.attributes,
                render(CARD_TITLE, speechOutput, reprompt, false));
        } else {
            var gameQuestions = session.attributes.questions,
                correctAnswerIndex = parseInt(session.attributes.correctAnswerIndex),
                currentScore = parseInt(session.attributes.score),
                currentQuestionIndex = parseInt(session.attributes.currentQuestionIndex),
                correctAnswerText = session.attributes.correctAnswerText;

            var speechOutputAnalysis = "";

            if (answerSlotValid && intent.slots.Answer.value.toUpperCase() == correctAnswerText.toUpperCase()) {
                currentScore++;
                speechOutputAnalysis = "correct. ";
            } else {
                if (!userGaveUp) {
                    speechOutputAnalysis = "wrong. "
                }
                speechOutputAnalysis += "The correct answer is " + correctAnswerText + ". ";
            }
            // if currentQuestionIndex is 4, we've reached 5 questions (zero-indexed) and can exit the game session
            if (currentQuestionIndex == GAME_LENGTH - 1) {
                speechOutput = userGaveUp ? "" : "That answer is ";
                speechOutput += speechOutputAnalysis + "You got " + currentScore.toString() + " out of "
                    + GAME_LENGTH.toString() + " questions correct. Thank you for learning with Alexa!";
                callback(session.attributes,
                    render(CARD_TITLE, speechOutput, "", true));
            } else {
                currentQuestionIndex += 1;
                var spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]]);
                // Generate a random index for the correct answer, from 0 to 3
                correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
                var roundAnswers = populateRoundAnswers(gameQuestions, currentQuestionIndex, correctAnswerIndex),

                    questionIndexForSpeech = currentQuestionIndex + 1,
                    repromptText =  spokenQuestion ;
                for (var i = 0; i < ANSWER_COUNT; i++) {
                    repromptText +=  ""
                }
                speechOutput += userGaveUp ? "" : "That answer is ";
                speechOutput += speechOutputAnalysis + "Your score is " + currentScore.toString() + ". " + repromptText;

                sessionAttributes = {
                    "speechOutput": repromptText,
                    "repromptText": repromptText,
                    "currentQuestionIndex": currentQuestionIndex,
                    "correctAnswerIndex": correctAnswerIndex + 1,
                    "questions": gameQuestions,
                    "score": currentScore,
                    "correctAnswerText":
                        questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
                };
                callback(sessionAttributes,
                    render(CARD_TITLE, speechOutput, repromptText, false));
            }
        }
    }
}

function isAnswerSlotValid(intent) {
    var answerSlotFilled = intent.slots && intent.slots.Answer && intent.slots.Answer.value;
    var answerSlotIsInt = answerSlotFilled && !isNaN(parseInt(intent.slots.Answer.value));
    return 1;
}

// ------- Helper functions to build responses -------


function render(title, output, repromptText, shouldEndSession) {
    let stateRepresentation = { } ;
    stateRepresentation.outputSpeech = {
        type: "PlainText",
        text: output
    } ;
    if (title) {
        stateRepresentation.card = {
            type: "Simple",
            title: title,
            content: output
        } ;
    }
    stateRepresentation.reprompt = {
        outputSpeech: {
            type: "PlainText",
            text: repromptText
        }
    } ;
    stateRepresentation.shouldEndSession = shouldEndSession
    return stateRepresentation ;
}

function display(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
