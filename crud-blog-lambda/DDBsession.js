/*******************************************************************************************
 * The MIT License (MIT)
 * -----------------------------------------------------------------------------------------
 * Copyright (c) 2016 Convergence Modeling LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * https://opensource.org/licenses/MIT
 *
 */





// /////////////////////////////////////////////////////////////////
// DynamoDB session manager
//
//


'use strict' ;

// DynamoDB session manager
var DOC                 = require('dynamodb-doc') ;
// var BlueBirdPromise     = require('bluebird') ;
// var docClient           = BlueBirdPromise.promisifyAll(new DOC.DynamoDB()) ;
var docClientSync       = new DOC.DynamoDB() ;

var DynamoDBSessionManager = {

        dehydrateSession: (model,req) => {
            
            model.__token = model.__token || '1234' ;
            var params = {
                TableName: getTableName(req),
                Item: {
                    token: model.__token.toString(),
                    model: JSON.stringify(model)
                }
            };

            
            var p = new Promise(function(resolve, reject){
                docClientSync.putItem(params, function(error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        // not expecting anything
                        resolve(data);
                    }
                });
            }) ;
            
            // return p ;
            
            // bluebird implementation
            // return docClient.putItemAsync(params)  ;
        },

        rehydrateSession: (token,req) => {
            req = req || {env: {tableName: 'dynamodb-sam-session'}} ;
            let params = {
                TableName: getTableName(req),
                Key: {
                    token: token.toString()
                }
            };
            
            // bluebird implementation
            // var item = docClient.getItemAsync(params) ;
            // return docClient.getItemAsync(params) ;
            
            var p = new Promise(function(resolve, reject){
                docClientSync.getItem(params, function(error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        data.Item = data.Item || {} ;
                        data.Item.model = data.Item.model || "{}" ;
                        resolve(JSON.parse(data.Item.model));
                    }
                });
            }) ;
            
            return p ;
            
        }

} ;

function getTableName(request) {
    // The table name is stored in the Lambda stage variables
    // Go to https://console.aws.amazon.com/apigateway/home/apis/[YOUR API ID]/stages/latest
    // and click Stages -> latest -> Stage variables

    // These values will be found under request.env
    // Here's I'll use a default if not set
    // return request.env.tableName || 'dynamodb-sam-session';
    return 'dynamodb-sam-session';
}

module.exports = DynamoDBSessionManager ;