import { DynamoDB } from 'aws-sdk';
import { Subscriber } from './Subscriber';

const dynamo = new DynamoDB.DocumentClient();

const TableName = 'SUBSCRIBER';
const SlugIndex = 'SubscriberIndex';

export class SubscriberRepository {
  findAll = async () => {
    const subscriberResults = await dynamo.scan({
      TableName
    }).promise();
    
    if (!subscriberResults.Items || subscriberResults.Items.length === 0) {
      return [];
    } else {
      const subscribersData = subscriberResults.Items;
      
      return subscribersData.map((subscriberResult) => new Subscriber(subscriberResult)).reverse();
    }
  }

  findById = async (id: string) => {
    const subscriberResults = await dynamo.query({
      TableName,
      KeyConditionExpression: "subscriberId = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    }).promise();
    
    if (!subscriberResults.Items || subscriberResults.Items.length === 0) {
      return undefined;
    } else {
      return new Subscriber(subscriberResults.Items[0]);
    }
  };

  findByEmail = async (email: string) => {
    const subscriberResults = await dynamo.query({
      TableName,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email
      }
    }).promise();
    
    if (!subscriberResults.Items || subscriberResults.Items.length === 0) {
      return undefined;
    } else {
      return new Subscriber(subscriberResults.Items[0]);
    }
  };

  save = async (subscriber: Subscriber) => {
    return await dynamo.put({
      TableName,
      Item: subscriber
    }).promise();
  };

  delete = async (id: string) => {
    return await dynamo.delete({ 
      TableName,
      Key: { postId: id }
    });
  }
}