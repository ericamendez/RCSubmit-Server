import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import path from "path";
import cors from 'cors';
import express from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import typeDefs from './graphql/schemas/index.js';
import resolvers from './graphql/resolvers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.set('strictQuery', false)

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start(); // Start Apollo Server

  const app = express(); // Create an Express app
  app.use(cors())

  // Middleware to handle file uploads using graphql-upload
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // Serve the 'uploads' folder statically
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
