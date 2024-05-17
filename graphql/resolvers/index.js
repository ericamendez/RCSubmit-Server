const User = require('../../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

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
          const newUser = new User({ username, password: hashedPassword, accountType});
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
  
module.exports = resolvers