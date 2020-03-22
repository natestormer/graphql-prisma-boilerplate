// For subscriptions and websocket support:
// https://gist.github.com/andrewjmead/acdd7bc29d853f8d7a8962d6a1d9ae5a
import ApolloBoost from "apollo-boost"

const getClient = jwt => {
  return new ApolloBoost({
    uri: "http://localhost:4000",
    request(operation) {
      if (jwt) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
      }
    },
  })
}

export { getClient as default }
