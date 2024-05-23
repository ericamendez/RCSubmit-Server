import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { FragmentsOnCompositeTypesRule, GraphQLError } from 'graphql';
import { fileURLToPath } from 'url';
import User from '../../models/user.js';
import WeeklyAssignments from '../../models/weekly-assigments.js'
import Assignment from '../../models/assignment.js'
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..')

// const init = async () => {
//   const newWeek = new WeeklyAssignments({
//     week: '20',
//     assignments: [],
//     current: false,
//     dueDate: ''
//   });
//   await newWeek.save();
//   console.log(newWeek)
// }

const resolvers = {
  Query: {
    dummy: () => 0,
    getUser: async (root, args) => {
      const { id } = args
      const data = await User.findOne({ _id: id })

      const send = {
        name: data.name,
        username: data.username,
        accountType: data.accountType,
        profilePicture: data.profilePicture,
        email: data.email,
        cohort: data.cohort,
        pronouns: data.pronouns
      }

      return send
    },
    getAllWeeks: async () => {
      const data = WeeklyAssignments.find({})
      return data
    },
    getWeeksAssignments: async (root, args) => {
      const { week } = args
      const data = await Assignment.find({ week }).exec();
      console.log(data)
      return data
    }
  },
  Upload: GraphQLUpload,
  Mutation: {
    addAssignment: async (root, args) => {
      const { description, link, show, week, assignmentType } = args
      // console.log(description, link, show, week)
      const newAssignment = new Assignment({
        description,
        link,
        show,
        week,
        assignmentType
      })

      const weekly = await WeeklyAssignments.findOne({ week: week })
      weekly.assignments.push(newAssignment.description)

      console.log(weekly)

      try {
        await newAssignment.save()
        await weekly.save()
        return newAssignment
      } catch (error) {
        throw new GraphQLError('cant save assignment', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },
    deleteAssignment: async (root, args) => {
      try {
        const { id } = args
        console.log(id)
        const result = await Assignment.deleteOne({ _id: id })

        if (result.deletedCount === 0) {
          throw new Error('Assignment not found');
        }

        return true;
      } catch (error) {
        throw new GraphQLError('cant delete assignment', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },
    editUserInfo: async (root, args) => {
      const { userID, name, email, cohort, pronouns } = args

      const user = await User.findOne({ _id: userID })

      user.name = name
      user.email = email
      user.cohort = cohort
      user.pronouns = pronouns

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('cant update user info', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: userID,
            error
          }
        })
      }
    },
    createUser: async (root, args) => {
      try {
        const { username, password, accountType } = args;
        // Check if user with the provided email already exists

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

        return {
          value: jwt.sign(userForToken, process.env.JWT_SECRET),
          username: user.username,
          id: user._id,
          accountType: user.accountType,
          profilePicture: user.profilePicture
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    uploadProfilePicture: async (root, args) => {
      const { file, userID } = args
      const { createReadStream, filename, mimetype, encoding } = await file;

      const stream = createReadStream();
      const filePath = path.join(rootDir, 'uploads', filename);

      const out = fs.createWriteStream(filePath);
      stream.pipe(out);

      const user = await User.findOne({ _id: userID })
      user.profilePicture = filename

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