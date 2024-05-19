import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { GraphQLError } from 'graphql';
import { fileURLToPath } from 'url';
import User from '../../models/user.js';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..')

const resolvers = {
  Query: {
    dummy: () => 0,
    user: async (root, args) => {
      const { id } = args
      const data = await User.findOne({ id })
      return data
    }
  },
  Upload: GraphQLUpload,
  Mutation: {
    createUser: async (root, args) => {
      try {
        const { username, password, accountType } = args;
        // Check if user with the provided email already exists
        console.log('args', args)
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({ username, password: hashedPassword, accountType });
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
        console.log(user.username);

        return {
          value: jwt.sign(userForToken, process.env.JWT_SECRET),
          username: user.username,
          id: user._id,
          accountType: user.accountType,
          picture: user.picture
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    autogenerate: async (root, args) => {
      const text = await chatGPTDescriptionCompletion(args.title)
      console.log("correct place", text);
      return text
    },
    uploadProfilePicture: async (root, args) => {
      const { file, userID } = args
      const { createReadStream, filename, mimetype, encoding } = await file;

      const stream = createReadStream();
      const filePath = path.join(rootDir, 'uploads', filename);
      console.log(filePath);
      const out = fs.createWriteStream(filePath);
      stream.pipe(out);
      console.log(userID)

      const user = await User.findOne({ _id: userID })
      user.picture = filename

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('cant update user picture', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: userID,
            error
          }
        })
      }

      return new Promise((resolve, reject) => {
        out.on('finish', () => resolve(`File uploaded: ${filename}`));
        out.on('error', reject);
      });
    }
  }
}

export default resolvers