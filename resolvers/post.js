const { gql } = require('apollo-server-express')
const { posts } = require('../temp')

// Queries
const totalPosts = () => posts.length
const allPosts = () => posts

// Mutations
const newPost = (parent, args) => {
  const { title, description } = args.input
  post = {
    id: posts.length + 1,
    title,
    description,
  }

  posts.push(post)
  return post
}

module.exports = {
  Query: {
    totalPosts,
    allPosts,
  },
  Mutation: {
    newPost,
  },
}
