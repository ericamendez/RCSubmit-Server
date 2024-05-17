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
const typeDefs = require('./graphql/schemas/index');
const resolvers = require('./graphql/resolvers/index');

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
