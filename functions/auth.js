"use strict";

const AWS = require("aws-sdk");
const createRefreshToken = require("../createRefreshToken");

const createToken = require('../createToken')
const response = require('../response');

module.exports.handle = async (event) => {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  const { email, password } = JSON.parse(event.body)

  try {

    const params = {
      TableName: process.env.DYNAMODB_USER_TABLE,
      FilterExpression: "email = :email AND password = :password",
      ProjectionExpression: "primary_key, email, #role",
      ExpressionAttributeNames: {
        '#role':'role',
      },
      ExpressionAttributeValues: {
        ":email": email,
        ":password": password
      }
    }
    const result = await dynamoDB.scan(params).promise();

    if (result.Items == 0) {
      throw new Error('Invalid Credentials')
    }

    const user = result.Items[0]
    const token = createToken(user.primary_key, user.role)
    const refreshT = createRefreshToken(user.primary_key, user.role)

    return response(200, { message: 'Logged In Successfully', token, refreshT })

  } catch (error) {
    return response(401, { error: error.message })
  }


};
