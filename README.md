# SAM Samples

Samples and snippets of application components constructed using [AWS SAM, Serverless Application Model][aws-sam].

All samples are authored in JavaScript for the Node.js AWS Lambda runtime.

## Acknowledgements

This is a [LEAN**STACKS**][leanstacks] solution.

## What's Inside

Each sub-directory contains a sample project illustrating a specific feature or group of features. Some samples build upon concepts from other samples.

If you are new to serverless software engineering or simply looking for a table of contents, the list below is a general guideline for exploring the samples in this repository in a meaningful order.

### rest-hello

The [rest-hello](./rest-hello/README.md) sample is an introduction to AWS SAM. Deploy a "Hello World" REST API application demonstrating how to handle events from the API Gateway in AWS Lambda.

### rest-dynamodb

The [rest-dynamodb](./rest-dynamodb/README.md) sample introduces using DynamoDB with AWS SAM. This is a basic example of how to implement REST API endpoints which provide CRUD operations for a simple business domain _"Item"_. Data for the REST resource is persisted in DynamoDB.

This sample application is the introductory example for using DynamoDB. This project contains other DynamoDB samples which build upon this one.

### rest-dynamodb-local

The [rest-dynamodb-local](./rest-dynamodb-local/README.md) sample builds upon the `rest-dynamodb` sample. This sample demonstrates how to run the SAM application locally with DynamoDB.

### rest-dynamodb-modular

The [rest-dynamodb-modular](./rest-dynamodb-modular/README.md) sample illustrates how to implement REST services with a more modular code structure. This sample builds on the `rest-dynamodb-local` sample. Many of the samples in this project illustrate a particular Serverless concept and all of the logic is contained within the function handler. While this serves to illustrate the concept of the example, it is not meant to illustrate best practices when creating serverless applications.

### rest-middy

The [rest-middy](./rest-middy/README.md) sample SAM application introduces the `Middy` middleware package. Middy allows you to reduce boilerplate code, moving it into reusable middlewares which you may reuse across your functions. This allows your engineers to focus on the business logic of the function rather than the non-functional code.

## See Also

[LEAN**STACKS**][leanstacks]  
[LEAN**STACKS** Serverless [Framework] Samples](https://github.com/leanstacks/serverless-samples)  
[AWS Serverless Application Model][aws-sam]  
[AWS SAM Documentation][aws-sam-docs]  
[AWS SAM Examples Repository][aws-sam-repos-examples]

[leanstacks]: https://leanstacks.com/ 'LEANSTACKS'
[aws-sam]: https://aws.amazon.com/serverless/sam/ 'AWS Serverless Application Model (SAM)'
[aws-sam-docs]: https://docs.aws.amazon.com/serverless-application-model/index.html 'SAM Documentation'
[aws-sam-repos-examples]: https://github.com/amazon-archives/serverless-app-examples 'SAM Examples Repo'
