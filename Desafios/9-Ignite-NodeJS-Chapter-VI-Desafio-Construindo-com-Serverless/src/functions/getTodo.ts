import { APIGatewayEvent } from "aws-lambda"
import { document } from "../utils/dynamodbClient";

export const handle = async (event: APIGatewayEvent) => {

    const { userid: user_id } = event.pathParameters;

    const response = await document.query({
        TableName: "todos",
        IndexName: "UserIdIndex",
        KeyConditionExpression: "user_id = :userid",
        ExpressionAttributeValues: {
            ":userid": user_id
        },
        ScanIndexForward: true,
        ConsistentRead: false,
        Select: 'ALL_ATTRIBUTES',
    }).promise();

    const user = response.Items[0];

    if (!user) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Usuario não existe.",
            })
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Lista Todo!",
            content: response,
        }),
        headers: {
            "Content-type": 'application/json',
        },
    };
}