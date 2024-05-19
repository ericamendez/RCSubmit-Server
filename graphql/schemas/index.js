const typeDefs = `
  scalar Upload
  
  type User {
    username: String!
    id: ID!
    password: String!
    accountType: String!
    name: String
    email: String
    pronouns: String
    profilePicture: String
    cohort: String
  }
  
  type Token {
    value: String!
    username:String
    id: ID!
    accountType: String!
  }


  type Query {
    dummy: Int
    taskCount: Int!
    user: User
  }

  type Mutation {
    createUser(
      username: String!
      password: String!
      accountType: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    autogenerate(
      title: String!
    ): String
    uploadProfilePicture(
      file: Upload!
      userID: String!
    ): String
  }
`

export default typeDefs