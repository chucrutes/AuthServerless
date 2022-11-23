const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const authToken = require('../config');
const response = require('../response');

module.exports.handle = async (event, context) => {
    try {
        const authorization = event.headers.authorization

        if (!authorization) {
            throw new Error('Token não encontrado')
        }

        const [_, token] = authorization.split(" ")

        if (!token) {
            throw new Error('Token não encontrado')
        }

        const Tokinho = jwt.verify(token, authToken.secret)
        const params = {
            TableName: process.env.DYNAMODB_USER_TABLE,
            FilterExpression: "primary_key = :primary_key",
            ProjectionExpression: "primary_key, email",
            ExpressionAttributeValues: {
                ":primary_key": Tokinho.user_id
            }
        }
        const result = await dynamoDB.scan(params).promise();

        if (result.Items == 0) {
            throw new Error('Token inválido')
        }

        return next()

    } catch (error) {
        return response(401, { error: error.message })
    }

}