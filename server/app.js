import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const users = [
  {
    "id": 1,
    "name": "Alice Johnson",
    "age": 20,
    "isStudent": true
  },
  {
    "id": 2,
    "name": "Brian Lee",
    "age": 22,
    "isStudent": true
  },
  {
    "id": 3,
    "name": "Carmen Smith",
    "age": 19,
    "isStudent": true
  },
  {
    "id": 4,
    "name": "Derek Brown",
    "age": 25,
    "isStudent": false
  },
  {
    "id": 5,
    "name": "Emily Davis",
    "age": 21,
    "isStudent": true
  }
]

const typeDefs = `
  type Query{
    getUsers: [User]
    getUserById(id: ID!): User
  }

  type Mutation{
    createUser(name: String!, age: Int!, isStudent: Boolean!): User
  }

  type User{
    id: ID
    name: String
    age: Int
    isStudent: Boolean
  }
`
const resolvers = {
  Query: {
    getUsers: () => {
      return users;
    },
    getUserById: (parent, args) => {
      const id = parseInt(args.id); // assuming ids are numbers
      return users.find(user => user.id === id);
    }
  },
  Mutation: {
    createUser: (parent, args) => {
      const { name, age, isStudent } = args;
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        age,
        isStudent
      };

      users.push(newUser);
      return newUser
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: () => { },
  cors: {
    origin: 'http://localhost:5173/'
  }
});

console.log(`Server running at: ${url}`);