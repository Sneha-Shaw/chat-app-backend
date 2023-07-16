import express from 'express'
import {
    createConversation,
    getConversationByUser,
    deleteConversation,
    deleteAllConversations
} from '../controllers/conversationControllers.js'

const router = express.Router()

router.post('/create-conversations', createConversation)
router.get('/get-conversations/:senderId/:receiverId', getConversationByUser)
router.delete('/delete-conversations/:id', deleteConversation)
router.delete('/delete-conversations', deleteAllConversations)

export default router