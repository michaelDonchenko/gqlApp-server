const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./database/connectDB')
const { ApolloServer } = require('apollo-server-express')
const http = require('http')
const path = require('path')
const { makeExecutableSchema } = require('graphql-tools')
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')
const { loadFilesSync } = require('@graphql-tools/load-files')

dotenv.config()

app.use(cors())

//Init middleware
app.use(express.json({ limit: '5mb' }))

app.get('/rest', (req, res) => {
  return res.json('rest api is working.')
})

//Databae connection
connectDB()

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, './typeDefs'))
)

const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, './resolvers'))
)

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

// applyMiddleware method connects ApolloServer to a specific HTTP framework ie: express
apolloServer.applyMiddleware({ app })

// server
const httpserver = http.createServer(app)

//Port listener
const PORT = process.env.PORT || 8000

httpserver.listen(PORT, () => {
  console.log(`The app listening on port ${PORT}`)
  console.log(
    `graphql server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  )
})
