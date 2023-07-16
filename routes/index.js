import express from 'express'
import userRoute from './userRoutes.js'
import messageRoutes from './messageRoutes.js'
import conversationRoutes from './conversationRoutes.js'

const router = express.Router()

router.use('/users', userRoute)
router.use('/messages', messageRoutes)
router.use('/conversation', conversationRoutes)


export default router