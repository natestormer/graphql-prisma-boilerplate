import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../../src/prisma"

const userOne = {
  input: {
    name: "Jen",
    email: "jen@example.com",
    password: bcrypt.hashSync("Red098!@#$"),
  },
  user: undefined,
  jwt: undefined,
}

const userTwo = {
  input: {
    name: "Jared",
    email: "jared@example.com",
    password: bcrypt.hashSync("Red098!@#$"),
  },
  user: undefined,
  jwt: undefined,
}

const seedDatabase = async () => {
  // delete test data
  await prisma.mutation.deleteManyUsers()

  // create user 1
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.AUTH_SECRET)

  // create user 2
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  })
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.AUTH_SECRET)
}

export { seedDatabase as default, userOne, userTwo }
