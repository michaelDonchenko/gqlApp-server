const { gql } = require('apollo-server-express')

module.exports = gql`
  type Post {
    id: ID!
    title: String!
    description: String!
  }

  # input type
  input PostInput {
    title: String!
    description: String!
  }

  # Queries
  type Query {
    totalPosts: Int!
    allPosts: [Post!]!
  }

  # Mutations
  type Mutation {
    newPost(input: PostInput!): Post!
  }
`
