# SAM Lambda

SAM Lambda is a boiler plate project that implements the SAM pattern in AWS Lambda using DynamoDB to manage application/session state 

SAM Lambda is leveraging the SAM SAFE library to wire its components and dehydrate/rehydrate the application state.

```
|---Server-----
|-actions.js        the system's actions
|-model.js          the model that is managed by the SAFE container
|-state.js          the state function that returns the application state
|-view.js           the view components that are used to render the application state
|-server.js         the lambda implementation
|-DDBsession.js     the DynamoDB session manager
|
|---Client-----
|-blog.html         the home page of the application
|-blog.js           the wiring of the client events to the Lambda actions
|
```

To deploy the Lambda:
0. `npm install`
1. Make sure that all the files that will be deployed are chmod'ed to 777
2. Create the lambda
```
claudia create --name io_xgen_sam_safe_samples_lambda --region us-west-2 --api-module server --policies policies
```
Claudia will create a claudia.json files that contains the project's configuration. Subsequent changes will be deployed with the `claudia update` 
command. 

3. Create a `dynamodb-sam-session` table in the DynamoDB console
4. Make sure the lambda executor role has the appropriate policies (e.g Read/Write the session table)
5. Make sure that the Lambda is configured to run v4.3 of node.js
6. Deploy the API endpoint in the API Gateway console 
7. Copy the API endpoint to the blog.html file (API_ID from claudia.json file):
```
var endpoint = 'https://YOUR_API_ID.execute-api.us-west-2.amazonaws.com/latest' ;
```
8. Open the blog.html in your favorite browser


 
