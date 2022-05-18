import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection;
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to post User", async () => {
    const response = await request(app).post("/api/v1/users/").send({
      name: "User Test",
      email: "test@email.com",
      password: "admin",
    });
    expect(response.status).toBe(201);
  });
  it("Should not be able to post an already existing User", async () => {
    await request(app).post("/api/v1/users/").send({
      name: "User1",
      email: "testmail@email.com",
      password: "admin",
    });
    const response = await request(app).post("/api/v1/users/").send({
      name: "User2",
      email: "testmail@email.com",
      password: "admin",
    });
    expect(response.status).toBe(400);
  });
});
