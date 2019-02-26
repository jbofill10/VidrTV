import ApolloClient, { InMemoryCache } from "apollo-boost";

const client = new ApolloClient({
	uri: "/graphql",
	cache: new InMemoryCache()
});

export { client };
