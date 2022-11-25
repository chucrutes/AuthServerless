const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const { authToken, _ } = require('../config');
const response = require('../response');

function generateAuthResponse(principalId, effect, routeArn) {
    const policyDocument = generatePolicyDocument(effect, routeArn)

    return {
        principalId,
        policyDocument
    };
}

function generatePolicyDocument(effect, routeArn) {
    if (!effect || !routeArn) return null

    const policyDocument = {
        Version: "2020-10-17",
        Statement: [
            {
                Action: "execute-api:Invoke",
                Effect: effect,
                Resource: routeArn
            }
        ]
    }

    return policyDocument
}

module.exports.handle = async (event, context) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    try {
        const token = event.headers.authorization

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

        return response(200, { decodedToken: Tokinho })

    } catch (error) {
        return response(401, { error: error.message })
    }

}