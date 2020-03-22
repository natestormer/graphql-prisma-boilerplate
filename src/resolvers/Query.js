import getUserId from "../utils/getUserId"

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    }

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
        ],
      }
    }

    return prisma.query.users(opArgs, info)
  },
  async me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const users = await prisma.query.users(
      {
        where: {
          id: userId,
        },
      },
      info
    )

    if (users.length === 0) {
      throw new Error("You were not found")
    }

    return users[0]
  },
}

export { Query as default }
