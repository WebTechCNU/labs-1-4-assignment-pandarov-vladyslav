const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const serverless = require("serverless-http");
const connectDB = require("./db");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

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

function requireAuth(user) {
  if (!user) {
    throw new Error("Unauthorized: login required");
  }
}

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
    createItem: async (_, { name, description }, { user }) => {
      requireAuth(user);

      const collection = await connectDB();
      const newItem = { name, description };
      const result = await collection.insertOne(newItem);

      return {
        _id: result.insertedId.toString(),
        name,
        description,
      };
    },

    updateItem: async (_, { id, name, description }, { user }) => {
      requireAuth(user);

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

    deleteItem: async (_, { id }, { user }) => {
      requireAuth(user);

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
  context: ({ req }) => {
    const headers = req?.headers || {};
    const authHeader = headers.authorization || headers.Authorization;

    let user = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        throw new Error("Forbidden: invalid token");
      }
    }

    return { req, user };
  },
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
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: ""
    };
  }

  const handler = await startServer();
  return handler(event, context);
};