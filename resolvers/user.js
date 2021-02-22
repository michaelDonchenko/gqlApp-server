const { authCheck } = require('../helpers/auth')
const User = require('../models/user')

const userCreateOrUpdate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req)

  const user = await User.findOne({ email: currentUser.email })

  return user ? user : await User({ email: currentUser.email }).save()
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

module.exports = {
  Mutation: {
    userCreateOrUpdate,
    userUpdate,
  },
  Query: {
    userDetails,
  },
}
