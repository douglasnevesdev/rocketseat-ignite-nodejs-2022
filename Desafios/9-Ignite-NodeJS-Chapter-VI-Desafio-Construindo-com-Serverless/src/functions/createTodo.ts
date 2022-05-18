import { APIGatewayEvent } from "aws-lambda"
import { document } from "../utils/dynamodbClient";
import { v4 as uuidv4 } from "uuid";

interface ICreateTodo {
  title: string;
  deadline: Date;
}

export const handle = async (event: APIGatewayEvent) => {

  const { userid: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  await document.put({
    TableName: "todos",
    Item: {
      id: uuidv4(),
      user_id,
      title,
      done: false,
      deadline: deadline
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo foi criado!"
    }),
    headers: {
      "Content-type": "application/json",
    },
  }
};