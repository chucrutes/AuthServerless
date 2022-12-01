"use strict";

const { getAll } = require('../utils/dynamodb');
const createRefreshToken = require("../utils/createRefreshToken");


const createToken = require('../utils/createToken')
const response = require('../utils/response');

module.exports.handle = async (event) => {
  const { email, password } = JSON.parse(event.body)
  console.log(process.env.DYNAMODB_USER_TABLE)

  try {
    const params = {
      TableName: process.env.DYNAMODB_USER_TABLE,
      FilterExpression: "email = :email AND password = :password",
      ProjectionExpression: "primary_key, email, password, #role",
      ExpressionAttributeNames: {
        '#role':'role',
      },
      ExpressionAttributeValues: {
        ":email": email,
        ":password": password
      }
    }
    const {Items} = await getAll(params)
    console.log(Items)

    if (Items == null) {
      throw new Error('Invalid Credentials')
    }
    
    if(Items[0].password != password){
      console.log('teste')
      throw new Error('Invalid Credentials')
    }

    const token = createToken(Items[0].primary_key, Items[0].role)
    const refreshT = createRefreshToken(Items[0].primary_key, Items[0].role)

    return response(200, { message: 'Logged In Successfully', token, refreshT })

  } catch (error) {
    return response(401, { error: error.message })
  }
};
