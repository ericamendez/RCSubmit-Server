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

  type Cohort {
    id: ID!
    name: String!
    startDate: String!
    endDate: String!
    isCurrentCohort: Boolean!
    currentWeek: Int!
    students: [User]
  }

  type Query {
    dummy: Int
    taskCount: Int!
    getUser(id: String!): User
    getAllWeeks: [Week!]!
    getWeeksAssignments(week: Int!): [Assignment]
    getAllCohorts: [Cohort]!
  }

  type Mutation {
    addAssignment(
      description: String!
      link: String
      show: Boolean!
      week: Int!
      assignmentType: String
    ): Assignment
    deleteAssignment(id: ID!): String!
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
    addCohort(
      name: String!
      startDate: String!
      endDate: String!
    ): Cohort
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