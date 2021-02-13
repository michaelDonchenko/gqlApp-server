const { gql } = require('apollo-server-express')

const me = () => 'Mike'

module.exports = {
  Query: {
    me,
  },
}
