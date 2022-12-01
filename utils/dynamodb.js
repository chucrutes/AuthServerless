const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocument,
    PutCommand,
    QueryCommand,
    UpdateCommand,
    ScanCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");


const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

const client = new DynamoDBClient({});

const documentClient = DynamoDBDocument.from(client, translateConfig);

const save = async (params) => {
    return documentClient.send(new PutCommand(params))
}

const getItem = async (query) => {
    return documentClient.send(new QueryCommand(query));
}

const getAll = async (params) => {
    return documentClient.send(new ScanCommand(params));
};

const update = async (params) => {
    return result = documentClient.send(new UpdateCommand(params))
}

const destroy = async (params) => {
    return documentClient.send(new DeleteCommand(params));
};

const existsBy = async (params) => {
    const result = await documentClient.send(new QueryCommand(params));
    return result.Count > 0;
};

module.exports = { getItem, getAll }
