## Introduction

Where is the closest Tesco supermarket? What are the tea brands sold at Tesco? 

If you ever lived in the UK, you would have liked someone to ask the above questions. What if you can do it via WhatsApp?

This blog post will help you integrating **Tesco API** with **Nexmo Messages API** and **Over AI Bot**.

## Getting started


Before you begin you'll need to install the Serverless Framework.

### Serverless 

You can install the [Serverless](https://serverless.com/framework/docs/getting-started#installing-via-npm) framework directly from npm

```
# Install the serverless cli
npm install -g serverless

# Or, update the serverless cli from a previous version
npm update -g serverless

```

#### Serverless YML

The Yaml file describes the services that will be deployed on your aws account. In this case is a lambda function with his API Gateway associated.

```
functions:
  wa-inbound-webhook:
    handler: functions/wa-inbound-webhook.handler
    events:
      - http:
          path: wa-inbound
          method: post
          cors: true

```
 
#### Deploy the service on your AWS account

To deploy the service on your AWS account, you simply need to create an IAM role with capabilities of creating, updating and delete Lambda and API Gateway services.

1. Configure your AWS Profile: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
2. Create your local config file. Create a config.json file with your credentials (Nexmo, Tesco and Over AI Credentials). Please check the `config.example.json` file.
3. Run `serverless deploy --aws-profile {yourAwsProfile}`

Repeat step 3 if you want to update the functions.

### Conclusion

So what did we learn in this post?

We created an integration between OverAI bot and Nexmo Messages (WhatsApp). 
We created three main intents and pull data from an external API (Tesco API) to enable the bot to reply with additional information.

This flow can be implemented and integrated with any external API so the use cases are infinite! 
