# SAM Serverless Samples: rest-dynamodb-local

This project contains source code and supporting files for a serverless application that you can deploy with the AWS Serverless Application Model (AWS SAM) command line interface (CLI). It includes the following files and folders:

- `app` - The SAM application.
- `app\docker-compose.yaml` - A Docker Compose configuration file to run DynamoDB locally.
- `app\src` - Code for the application's Lambda function.
- `app\events` - Invocation events that you can use to invoke the function.
- `app\src\__tests__` - Unit tests for the application code.
- `template.yaml` - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions, an API Gateway API, and Amazon DynamoDB tables. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Prerequisites

The following are required to run this sample.

- AWS Account
- SAM CLI
- NVM with Node 16.x (lts/gallium)
- Docker and Docker Compose

> **NOTE:** Amazon DynamoDB runs locally in a Docker container.

## Build

Run the following command in the sample base directory:

```bash
sam build
```

## Run Locally

> **NOTE:** Requires that Docker and Docker Compose are installed. See the [installation guide][docker-install].

This sample project illustrates how a SAM application which depends on DynamoDB can be run locally.

### How it works

To run your function locally with DynamoDB, you need to do 3 things.

First, you need to run DynamoDB locally in a Docker container.

Second, you need to create the `SampleTable` in the local DynamoDB.

Third, you need to configure the DynamoDB Client in your functions to connect to the container-hosted DynamoDB when running the functions locally.

#### Running the DynamoDB Docker container

Reference the `docker-compose.yaml` file in this sample. This Docker Compose configuration file provisions an ephemeral instance of DynamoDB on a Docker network named `sam-samples`.

> **NOTE:** The Docker network is important. Both the functions and DynamoDB must run on the same Docker network.

#### Creating the Table

With the DynamoDB container running, use the AWS CLI to create the `SampleTable` table. Use the following command at a terminal prompt:

```bash
aws dynamodb create-table --cli-input-json file://etc/dynamodb/sample-table-create.json --endpoint-url http://localhost:8000
```

This command connects to the local DynamoDB instance and issues the command found in the JSON file specified by the `--cli-input-json` parameter. The JSON contains the _create table_ specification for our `SampleTable`.

#### Configuring functions to connect to local DynamoDB

When a SAM application is run locally, the `AWS_SAM_LOCAL` environment variable is present, e.g. `AWS_SAM_LOCAL="true"`. Use this variable in your function logic to configure the DynamoDB client accordingly. Reference any of the functions in this sample to view a complete example.

When a function is running in AWS, the AWS SDK knows the `endpoint` to use to connect to DynamoDB in a specific AWS Region. However, when running locally, we need to tell the DynamoDB client the `endpoint` for our local DynamoDB. This is where Docker Compose and our Docker network are important.

Here is a snippet from one of the functions in this sample:

```javascript
const AWS_SAM_LOCAL = process.env.AWS_SAM_LOCAL;

...

const dynamoDBClientConfig = {
  region: AWS_REGION,
};
if (AWS_SAM_LOCAL) {
  dynamoDBClientConfig.endpoint = 'http://dynamodb:8000';
}
const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient(dynamoDBClientConfig),
  translateConfig,
);
```

The DynamoDB client configuration object is updated to override the `endpoint` attribute when running locally. The endpoint URL uses the hostname and port of the Docker Compose _service_ which we named `dynamodb` in `docker-compose.yaml`.

It is important for the SAM application to run on the **same** Docker network as DynamoDB. The `sam local` command has a parameter named `--docker-network` which allows you to specify the Docker network.

Start the sample application using the following command at a terminal prompt:

```bash
sam local start-api --docker-network sam-samples
```

#### Putting it all together

If you are thinking that this is a lot of commands to issue every time you want to run the application locally... it is. To simplify running the application locally, we use NPM commands and the `npm-run-all` package.

To start DynamoDB locally, create the `SampleTable`, and build your code simply run the following commands:

```bash
cd app
npm install
npm run start:local
```

The `start:local` script starts DynamoDB, creates the table, runs 'sam build' once, **and** watches your code for changes running 'sam build' again each time you make a change.

You can leave that running in one terminal and now develop using `sam local` commands as you normally would. Open a second terminal and from the sample base directory (where the `template.yaml` file is located), run:

```bash
sam local start-api --docker-network sam-samples

## OR ##

sam local invoke createItemFunction --event app/events/event-create-item.json --docker-network sam-samples
```

When you are done using DynamoDB locally, simply run the following commands:

```bash
cd app
npm run stop:local
```

## Deploy to AWS

Run the following command in the sample base directory:

```bash
sam deploy --guided # to use the default AWS profile

## OR ##

sam deploy --guided --profile [profileName] # to specify the AWS profile
```

The command will package and deploy your application to AWS, with a series of prompts:

- **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
- **AWS Region**: The AWS region you want to deploy your app to.
- **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
- **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
- **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

The API Gateway endpoint API will be displayed in the outputs when the deployment is complete.

## Run on AWS

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

To run the you may use an API client like Postman or a command line tool such as `curl`.

### curl

```bash
curl [endpointUrl]

## for example ###

curl https://ulgpuwhw90.execute-api.us-east-1.amazonaws.com/Prod/
```

### Postman

Import the Postman collection from the base directory of the sample. Update the `gatewayUrl` collection variable to the endpoint URL provided in the output from the `sam deploy` command.

## Remove from AWS

Run the following command in the sample base directory:

```bash
sam delete
```

## Add a resource to your application

The application template uses AWS SAM to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources, such as functions, triggers, and APIs. For resources that aren't included in the [AWS SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use the standard [AWS CloudFormation resource types](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html).

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, the AWS SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs that are generated by your Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

> **NOTE:** This command works for all Lambda functions, not just the ones you deploy using AWS SAM.

```bash
sam logs -n listItemsFunction --stack-name sam-samples-rest-dynamodb --tail
```

> **NOTE:** This uses the logical name of the function within the stack. This is the correct name to use when searching logs inside an AWS Lambda function within a CloudFormation stack, even if the deployed function name varies due to CloudFormation's unique resource name generation.

You can find more information and examples about filtering Lambda function logs in the [AWS SAM CLI documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Testing

Tests are defined in the `app/src/__tests__` directory of this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
npm install
npm run test
```

[docker-install]: https://docs.docker.com/engine/install/ 'Install Docker Engine'
