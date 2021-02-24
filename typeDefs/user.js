const { gql } = require('apollo-server-express')

module.exports = gql`
  # scalar type
  scalar DateTime

  type userCreateResponse {
    username: String!
    email: String!
  }

  type Image {
    url: String
    public_id: String
  }

  type User {
    _id: ID!
    username: String
    email: String
    images: [Image]
    about: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input ImageInput {
    url: String
    public_id: String
  }

  input UserUpdateInput {
    username: String
    images: [ImageInput]
    about: String
  }

  type Mutation {
    userCreateOrUpdate: userCreateResponse!
    userUpdate(input: UserUpdateInput!): User!
  }
  type Query {
    userDetails: User
    publicProfile(email: String!): User!
    allUsers: [User!]
  }
`
