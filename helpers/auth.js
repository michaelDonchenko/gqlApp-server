const admin = require('../firebase')

// token check middleware
exports.authCheck = async (req) => {
  try {
    const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken)
    return currentUser
  } catch (error) {
    console.log('Auth check error:', error)
    throw new Error('Invalid or expired token')
  }
}

exports.authCheckMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authtoken) {
      return res.send({ error: 'No token request denied' })
    }
    const res = await admin.auth().verifyIdToken(req.headers.authtoken)
    if (res) {
      next()
    }
  } catch (error) {
    console.log('Auth check error:', error)
    return res.status(400).json({ error: 'Invalid token' })
  }
}
