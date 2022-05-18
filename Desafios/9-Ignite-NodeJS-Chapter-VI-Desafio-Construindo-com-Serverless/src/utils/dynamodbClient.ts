import { DynamoDB } from "aws-sdk";

const options = {
    region: "localhost",
    endpoint: "http://localhost:8000",
    accessKeyId: "xxxxxx",
    secretAccessKey: "xxxxxx",
};

export const document = new DynamoDB.DocumentClient(options);

/*
const isOffline = () => {
    return process.env.IS_OFFLINE;
};

export const document = isOffline()
    ? new DynamoDB.DocumentClient(options)
    : new DynamoDB.DocumentClient();
*/