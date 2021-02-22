const express = require('express')
const { authCheckMiddleware } = require('../helpers/auth')
const router = express.Router()
const cloudinary = require('cloudinary')
const User = require('../models/user')

//cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

//upload image
router.post('/uploadImages', authCheckMiddleware, async (req, res) => {
  let { image, email } = req.body
  let user = await User.findOne({ email }).exec()
  if (user.images.length >= 10) {
    return res.status(400).json({ error: 'Cannot upload more than 10 images' })
  }
  try {
    cloudinary.uploader.upload(image, async (result) => {
      let { public_id, secure_url } = result
      let newImage = { public_id, url: secure_url }

      await user.images.unshift(newImage)

      await user.save()
      return res.status(201).send(user)
    })
  } catch (error) {
    res.status(400).json({ error: error })
  }
})

//delete image
router.post('/removeimage', authCheckMiddleware, async (req, res) => {
  let { imageId, email } = req.body
  if (!imageId) {
    return res.status(400).json({ error: 'Could not find the image' })
  }
  try {
    cloudinary.uploader.destroy(imageId, async ({ result }) => {
      if (result === 'ok') {
        let user = await User.findOne({ email }).exec()
        let filtered = await user.images.filter(
          (image) => image.public_id !== imageId
        )

        user.images = filtered
        await user.save()
        return res.status(201).send(user)
      }
      return res.status(400).json({ error: 'Could not delete the image' })
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error })
  }
})

//set profile image
router.post('/setProfileImage', authCheckMiddleware, async (req, res) => {
  let { imageId, email } = req.body
  if (!imageId) {
    return res.status(400).json({ error: 'Could not find the image' })
  }
  try {
    let user = await User.findOne({ email }).exec()

    let filtered = await user.images.filter(
      (image) => image.public_id !== imageId
    )

    let profileImage = await user.images.filter(
      (image) => image.public_id === imageId
    )

    user.images = filtered

    user.images.unshift(profileImage[0])

    await user.save()
    return res.status(201).send(user)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error })
  }
})

module.exports = router
