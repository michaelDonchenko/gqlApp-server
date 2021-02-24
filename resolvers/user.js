const { authCheck } = require('../helpers/auth')
const User = require('../models/user')

const userCreateOrUpdate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req)

  const user = await User.findOne({ email: currentUser.email }).exec()
  if (user) {
    return user
  }
  const newUser = await new User({ email: currentUser.email }).save()

  return newUser
}

const userUpdate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req)

  const updatedUser = await User.findOneAndUpdate(
    { email: currentUser.email },
    { ...args.input },
    { new: true }
  ).exec()

  return updatedUser
}

const userDetails = async (parent, args, { req }) => {
  const currentUser = await authCheck(req)

  const user = await User.findOne({ email: currentUser.email })

  return user
}

const publicProfile = async (parent, args, { req, res }) => {
  const user = await User.findOne({ email: args.email }).exec()
  if (!user) {
    throw new Error('User not found')
  }

  return user
}

const allUsers = async (parent, args, context) => {
  const users = await User.find()
    .sort([['createdAt', -1]])
    .exec()
  if (!users) {
    throw new Error('There are no users found')
  }

  return users
}

module.exports = {
  Mutation: {
    userCreateOrUpdate,
    userUpdate,
  },
  Query: {
    userDetails,
    publicProfile,
    allUsers,
  },
}
