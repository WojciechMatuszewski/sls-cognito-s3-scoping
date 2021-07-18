# SLS Cognito s3 access example

An example of how one might federate access to a bucket for Cognito authenticated users.
Each user uploads files to their own "folder". This "folder" is only accessible to that user.

## Deployment

- `npm run deploy` in the root directory

- populate the `frontend/App.js` config with the deployment outputs

- `cd frontend && npm install && npm start`

## Learnings

- Wojtek please always add the `Version` field to the policy statement.
  In this example, **the `2012-10-17` version adds support for the policy variables - the feature we use to restrict access to s3**

- The Amplify library is a bit better than it used to be, but still has a long way to go
