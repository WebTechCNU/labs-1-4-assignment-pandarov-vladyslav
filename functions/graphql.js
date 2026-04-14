const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const serverless = require("serverless-http");
const connectDB = require("./db");
const { ObjectId } = require("mongodb");

const typeDefs = gql`
  type Item {
    _id: ID!
    name: String!
    description: String!
  }

  type Query {
    items(skip: Int, take: Int, sortField: String, sortOrder: String): [Item]
    item(id: ID!): Item
  }

  type Mutation {
    createItem(name: String!, description: String!): Item
    updateItem(id: ID!, name: String, description: String): Item
    deleteItem(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    items: async (_, { skip = 0, take = 10, sortField = "name", sortOrder = "asc" }) => {
      const collection = await connectDB();

      const sort = sortField
        ? { [sortField]: sortOrder === "desc" ? -1 : 1 }
        : {};

      return await collection
        .find()
        .sort(sort)
        .skip(skip)
        .limit(take)
        .toArray();
    },

    item: async (_, { id }) => {
      const collection = await connectDB();
      return await collection.findOne({ _id: new ObjectId(id) });
    },
  },

  Mutation: {
    createItem: async (_, { name, description }) => {
      const collection = await connectDB();
      const newItem = { name, description };
      const result = await collection.insertOne(newItem);

      return {
        _id: result.insertedId.toString(),
        name,
        description,
      };
    },

    updateItem: async (_, { id, name, description }) => {
      const collection = await connectDB();

      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (description !== undefined) updateFields.description = description;

      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );

      return await collection.findOne({ _id: new ObjectId(id) });
    },

    deleteItem: async (_, { id }) => {
      const collection = await connectDB();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    },
  },
};

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }) => ({ event }),
});

let serverHandler;

async function startServer() {
  if (!serverHandler) {
    await server.start();
    server.applyMiddleware({ app, path: "/" });
    serverHandler = serverless(app);
  }
  return serverHandler;
}

exports.handler = async (event, context) => {
  const handler = await startServer();
  return handler(event, context);
};