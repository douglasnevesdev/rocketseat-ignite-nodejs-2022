

import { v4 as uuid } from "uuid"
import { hash } from "bcrypt"
import { document } from "../utils/dynamodbClient";

import { APIGatewayEvent } from "aws-lambda"

export const handle = async (event: APIGatewayEvent) => {
  const { username, password } = JSON.parse(event.body)

  const response = await document.scan({
    TableName: "users",
    ProjectionExpression: "username, id"
  }).promise()

  const [userAlreadyExists] = response.Items.filter(user => user.username === username)

  if (userAlreadyExists) return {
    statusCode: 409,
    body: JSON.stringify({
      error: "Usuario ja existe!"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }

  const user_id = uuid()

  await document.put({
    TableName: "users",
    Item: {
      id: user_id,
      username,
      password: hash(password, 10)
    }
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Usuario criado com sucesso!",
      user: {
        id: user_id,
        username
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }

}