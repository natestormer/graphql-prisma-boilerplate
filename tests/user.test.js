import "core-js"
import "regenerator-runtime/runtime"
import "cross-fetch/polyfill"
import { gql } from "apollo-boost"

import prisma from "../src/prisma"
import seedDatabase, { userOne } from "./utils/seedDatabase"
import getClient from "./utils/getClient"
import { createUser, getUsers, login, getProfile } from "./utils/operations"

const client = getClient()
beforeAll(() => {
  jest.setTimeout(10000)
})
beforeEach(seedDatabase)

test("Should create new user", async () => {
  const variables = {
    data: {
      name: "Nate",
      email: "nate@example.com",
      password: "mypass123",
    },
  }

  const response = await client.mutate({
    mutation: createUser,
    variables,
  })

  const userExists = await prisma.exists.User({
    id: response.data.createUser.user.id,
  })

  expect(userExists).toBe(true)
})

test("Should expose public author profiles", async () => {
  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(2)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe("Jen")
})

test("Should not login with bad credentials", async () => {
  const variables = {
    data: {
      email: "jen@example.com",
      password: "red098!@#$",
    },
  }

  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow()
})

test("Should not register password less than 8 characters", async () => {
  const variables = {
    data: {
      name: "Jack",
      email: "jack@example.com",
      password: "pass12",
    },
  }

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow()
})

test("Should fetch user profile", async () => {
  const client = getClient(userOne.jwt)

  const { data } = await client.query({ query: getProfile })
  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})
