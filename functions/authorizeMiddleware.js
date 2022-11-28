const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const { authToken, _ } = require('../config');


function generatePolicyDocument(effect, routeArn, userId, context) {
    if (!effect || !routeArn) {
        return null
    }

    const policy = {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: routeArn,
                },
            ],
        },
        context,
    };

    return policy
}

module.exports.handle = (event, context, callback) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const routeArn = event.routeArn
    try {
        const token = event.headers.authorization

        if (!token) {
            throw new Error('Token não encontrado')
        }
        
        const decodedToken = jwt.verify(token, authToken.secret)
        const params = {
            TableName: process.env.DYNAMODB_USER_TABLE,
            FilterExpression: "primary_key = :primary_key",
            ProjectionExpression: "primary_key, email",
            ExpressionAttributeValues: {
                ":primary_key": decodedToken.user_id
            }
        }
        const result = dynamoDB.scan(params).promise();
        
        if (result.Items == 0) {
            throw new Error('Token inválido')
        }
        const policy = generatePolicyDocument("Allow", routeArn, decodedToken.user_id, context)
        
        return callback(null, policy)
        
    } catch (error) {
        return callback("Unauthorized", null)
    }
    
}