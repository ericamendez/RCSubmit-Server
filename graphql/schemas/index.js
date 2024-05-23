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
    profilePicture: String
  }

  type Week {
    id: ID!
    week: String
    assignments: [String]
    current: Boolean
    dueDate: String
  }

  type Assignment {
    id: ID!
    description: String!
    link: String
    week: Int!
    show: Boolean!
    assignmentType: String
  }

  type Query {
    dummy: Int
    taskCount: Int!
    getUser(id: String!): User
    getAllWeeks: [Week!]!
    getWeeksAssignments(week: Int!): [Assignment]
  }

  type Mutation {
    addAssignment(
      description: String!
      link: String
      show: Boolean!
      week: Int!
      assignmentType: String
    ): Assignment
    deleteAssignment(id: ID!): Boolean!
    editUserInfo(
      userID: String!
      name: String
      email: String
      cohort: String
      pronouns: String
    ): User
    createUser(
      username: String!
      password: String!
      accountType: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    uploadProfilePicture(
      file: Upload!
      userID: String!
    ): String
  }
`

export default typeDefs