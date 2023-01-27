import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { AwsRequestContext, AwsFunctionRouter } from 'aws-rest-api-router';
import { StatusCodes } from 'http-status-codes';

const { v4: uuidv4 } = require('uuid');

import { SubscriberRepository } from './common/SubscriberRepository';
import { Subscriber } from './common/Subscriber';

const subscriberRepository = new SubscriberRepository();

const validateEmail = (email: any) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const router = new AwsFunctionRouter<Subscriber>({
    basePath: '/subscriber',
    includeCORS: true
  })
  .post('', async (route, requestContext) => {
    const subscriber = route.parseBody(requestContext);

    if (!validateEmail(subscriber.email)) {
      console.log('Invalid email address sent in request');

      return route.errorResponse(StatusCodes.BAD_REQUEST);
    }

    subscriber.subscriberId = uuidv4();
    subscriber.createDate = Date.now();
    subscriber.email = subscriber.email.toLowerCase();

    await subscriberRepository.save(subscriber);
    
    return route.okResponse(subscriber);
  })
  .put('/:email', async (route, requestContext) => {
    const email = route.getPathParams(requestContext).email.toLowerCase();
    const subscriberBody = route.parseBody(requestContext);

    if (!validateEmail(email)) {
      console.log('Invalid email address sent in request');

      return route.errorResponse(StatusCodes.BAD_REQUEST);
    }

    const subscriber = await subscriberRepository.findByEmail(email);

    if (subscriber) {
      subscriber.updateDate = Date.now();
      subscriber.unsubscribeAll = subscriberBody.unsubscribeAll;

      await subscriberRepository.save(subscriber);
    } else {
      return route.errorResponse(StatusCodes.NOT_FOUND);
    }
    
    return route.okResponse(subscriber);
  });

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  return await router.handle(new AwsRequestContext(event, context));
};
