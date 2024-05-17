const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { ApolloServer: ApolloServerExpress } = require('apollo-server-express'); // Import ApolloServer from apollo-server-express with a different name
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require("path");
const cors = require('cors')
const express = require('express');

mongoose.set('strictQuery', false)

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type User {
    username: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    dummy: Int
    taskCount: Int!
    me: User
  }

  type Mutation {
    createUser(
      username: String!
      password: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    autogenerate(
      title: String!
    ): String
  }
`

const resolvers = {
  Query: {
    dummy: () => 0,
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    createUser: async (root, args) => {
      try {
        const { username, password } = args;
        // Check if user with the provided email already exists
        console.log('args', args)
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        return newUser;
      } catch (error) {
        throw new Error(error);
      }
    },
    login: async (root, args) => {
      try {
        const { username, password } = args;
        // Find user by email
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('Invalid credentials');
        }
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }
        // Generate JWT token
        const userForToken = {
          username: user.username,
          id: user._id,
        }

        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      } catch (error) {
        throw new Error(error);
      }
    },
    autogenerate: async (root, args) => {
      const text = await chatGPTDescriptionCompletion(args.title)
      console.log("correct place", text);
      return text
    },
  }
}

async function startApolloServer() {
  const server = new ApolloServerExpress({
    typeDefs,
    resolvers,
  });

  await server.start(); // Start Apollo Server

  const app = express(); // Create an Express app
  app.use(cors())

  // server.applyMiddleware({ app }); // Apply Apollo Server middleware to Express app

  server.applyMiddleware({ app, path: '/graphql' });


  // Serve the 'dist' folder statically
  app.use(express.static(path.join(__dirname, 'dist')));

  const PORT = process.env.PORT || 4001;

  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}

startApolloServer(); // Call the function to start Apollo Server
