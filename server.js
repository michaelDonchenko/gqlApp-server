const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./database/connectDB')
const { ApolloServer } = require('apollo-server-express')
const path = require('path')
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')
const { loadFilesSync } = require('@graphql-tools/load-files')

dotenv.config()

// Init middleware
app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.use('/rest', require('./routes/cloudinary'))

// Databae connection
connectDB()

// merging types and resolvers
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, './typeDefs'))
)

const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, './resolvers'))
)

// create the apollo server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
})

// applyMiddleware method connects ApolloServer to a specific HTTP framework ie: express
apolloServer.applyMiddleware({ app })

//Port listener
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(
    `The app is ready on port ${PORT} at http://localhost:${PORT}/rest`
  )
  console.log(
    `graphql server is ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  )
})
