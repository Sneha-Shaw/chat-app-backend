import express from 'express'
import {
    getMessages,
    deleteAllMessages,
    deleteMessageById
} from '../controllers/messageControllers.js'

const router = express.Router()

router.get('/get-messages/:id', getMessages)
router.delete('/delete-messages/:id', deleteMessageById)
router.delete('/delete-messages', deleteAllMessages)


export default router