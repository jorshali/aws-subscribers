# aws-subscribers

A TypeScript-based project for creating a Subscriber REST API with [AWS SAM](https://aws.amazon.com/serverless/sam/).  For a complete tutorial using this project, check out: [Start tracking subscribers in AWS in under 30 minutes](https://jacoborshalick.me/posts/build-a-subscriber-rest-api-on-aws-in-under-30-minutes).

If you would like to setup your own portfolio site that integrates with this project, check out:  [Host a personal blog with Next.js and AWS in under 30 minutes](https://jacoborshalick.me/posts/nextjs-and-aws-amplify-host-a-personal-blog-in-under-30-minutes).

## Introduction

The project generates a Subscriber REST API that uses the following AWS services:

- [Cognito](https://www.google.com/search?client=safari&rls=en&q=aws+cognito&ie=UTF-8&oe=UTF-8)
- [AWS Gateway](https://aws.amazon.com/api-gateway/)
- [Lambda](https://aws.amazon.com/lambda/)
- [DynamoDB](https://aws.amazon.com/dynamodb/)

## Installation

The following prerequesites are needed:
* [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html)
* [Docker (recommended)](https://docs.docker.com/get-docker/)

Once you have installed the necessary prerequisites you can setup the project with the following command:

```
$ mkdir <project-directory>
$ cd <project-directory>
$ sam init --location git@github.com:jorshali/aws-subscribers.git
```

The starter project will now be available in the project directory you created.

## Building the Project

The following prerequesites are needed:

* An AWS Account.  If you don't have one, you can [create one here](https://aws.amazon.com).
* A deployment profile.  If you haven't created one, [follow these instructions](https://jacoborshalick.me/posts/build-a-subscriber-rest-api-on-aws-in-under-30-minutes).
* A development environment (optional, but recommended).  [Follow this guide](https://focus.dev/serverless-patterns-creating-deployment-environments-in-aws-with-organizations/) to setup deployment environments.

Once you have completed the prerequesites, follow these steps to deploy to an AWS environment:

1. Make sure you have selected the profile you want to deploy to.  All artifacts will be created in this account.  For example, on a Mac:

```
$ export AWS_PROFILE=<my-deployment-profile>
```

2.  Build the environment with AWS SAM:

```
sam build --beta-features
```

3.  Deploy to the environment using the profile:

```
sam deploy --guided
```

While being guided through the deployment, the defaults are recommended except for the Stack Name.  You can customize the Stack Name to something specific to your project.

4.  Once the deployment completes, it will print out 3 results:

```
Service endpoint URL for your App configuration
  https://{ApiGatewayApi}.execute-api.{AWS::Region}.amazonaws.com/V1/
The ID of the UserPool for use when running the environment setup script
  <user-pool-id>
The AWS ClientId that should be used in your authentication configuration
  <user-pool-add-client-id>
```

Hang onto these values as you will need them for the data setup and your calling application.

## Setting up Data (optional)

The data setup is optional.  Included in this project is a simple Cognito authentication setup.  This is intended for adding additional services for using the subscribers to send email blasts, newsletters, etc.

You can add a user with the following command:

```
$ sh scripts/add-user.sh
```

## Testing Locally

If you have Docker installed, you can start the project locally with the following commands:

```
$ sam build
$ sam local start-api
```

## Customizing the Project

Now that you have the project running, you probably want to do something useful.  The default project creates a CRUD service for blog posts.  This service implements:

- POST /subscriber - creates a new SUBSCRIBER record from the JSON body
- PUT /subscriber - updates a SUBSCRIBER record allowing them to unsubscribe

These service calls modify the data found in the DynamoDB table `SUBSCRIBER`.  To customize this service, have a look at the `subscriber\index.ts` file.
