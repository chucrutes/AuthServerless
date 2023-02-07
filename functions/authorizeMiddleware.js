const jwt = require('jsonwebtoken');
const { authToken, _ } = require('../utils/config');
const { getItem } = require('../utils/dynamodb');


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

module.exports.handle = async (event, context, callback) => {
    const routeArn = event.routeArn
    try {
        const token = event.headers.authorization

        if (!token) {
            throw new Error('Token não encontrado')
        }
        
        const decodedToken = jwt.verify(token, authToken.secret)
        const params = {
            TableName: process.env.DYNAMODB_USER_TABLE,
            KeyConditionExpression: '#primary_key = :primary_key',
            ExpressionAttributeNames: {
                '#primary_key':'primary_key',
              },
            ExpressionAttributeValues: {
                ":primary_key": decodedToken.user_id
            }
        }
       const result = await getItem(params)
        
        if (result.Items == 0) {
            throw new Error('Token inválido')
        }
        const policy = generatePolicyDocument("Allow", routeArn, decodedToken.user_id, context)
        
        return callback(null, policy)
        
    } catch (error) {
        return callback("Unauthorized", null)
    }
    
}