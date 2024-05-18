const typeDefs = `
  type User {
    username: String!
    id: ID!
    password: String!
    accountType: String!
    name: String
    email: String
    pronouns: String
    picture: String
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
    me: User
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
  }
`

module.exports = typeDefs