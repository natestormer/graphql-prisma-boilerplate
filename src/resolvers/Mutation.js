import bcrypt from "bcryptjs"

import getUserId from "../utils/getUserId"
import generateToken from "../utils/generateToken"
import hashPassword from "../utils/hashPassword"

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password)

    const user = prisma.mutation.createUser({
      data: {
        ...args.data,
        password: password,
      },
    })

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async login(parent, { data }, { prisma }, info) {
    const { email, password } = data
    const user = await prisma.query.user({
      where: {
        email: email,
      },
    })

    if (!user) {
      throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error("Unable to login")
    }

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    )
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info
    )
  },
}

export { Mutation as default }
