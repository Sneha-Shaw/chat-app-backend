import { populate } from "dotenv";
import conversationModel from "../models/conversationSchema.js";
import userModel from "../models/userSchema.js";

// @desc    create conversations
// @route   POST /create/conversations
// @access  Private
export const createConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body
        const sender = await userModel.findById(senderId)
        const receiver = await userModel.findById(receiverId)
        if (!sender || !receiver) {
            return res.status(400).json({
                success: false,
                message: 'Sender or receiver not found',
                data: null
            })
        }
        const conversation = await conversationModel.findOne({
            users: {
                $all: [senderId, receiverId]
            }
        })

        console.log(conversation);

        if (conversation) {
            return res.status(200).json({
                success: true,
                message: 'Conversation already exists',
                data: conversation
            })
        }
        const newConversation = new conversationModel({
            users: [senderId, receiverId]
        })
        await newConversation.save()
        res.status(200).json({
            success: true,
            message: 'Conversation created successfully',
            data: newConversation
        })
    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
}

// @desc    get conversations by user id
// @route   GET /get/conversations/:id
// @access  Private
export const getConversationByUser = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params
        const sender = await userModel.findById(senderId)

        if (!sender) {
            return res.status(400).json({
                success: false,
                message: 'Sender not found',
                data: null
            })
        }

        const receiver = await userModel.findById(receiverId)

        if (!receiver) {
            return res.status(400).json({
                success: false,
                message: 'Receiver not found',
                data: null
            })
        }

        const conversation = await conversationModel.findOne({
            users: {
                $all: [senderId, receiverId]
            }
        }).populate({
            path: 'users',
        }).populate({
            path: 'messages',
            populate: {
                path: 'user',
            }
        })

        if (!conversation) {
            return res.status(400).json({
                success: false,
                message: 'No Conversations found',
                data: null
            })
        }

        res.status(200).json({
            success: true,
            message: 'Conversation found successfully',
            data: conversation
        })


    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
}

// @desc   delete conversation by id
// @route  DELETE /delete/conversation/:id
// @access Private
export const deleteConversation = async (req, res) => {
    try {

        const { id } = req.params

        const conversation = await conversationModel.findById(id)

        if (!conversation) {
            return res.status(400).json({
                success: false,
                message: 'Conversation not found',
                data: null
            })
        }

        await conversation.remove()

        res.status(200).json({
            success: true,
            message: 'Conversation deleted successfully',
            data: null
        })


    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })

    }
}

// @desc   delete all conversations
// @route  DELETE /delete/conversations
// @access Private
export const deleteAllConversations = async (req, res) => {
    try {

        await conversationModel.deleteMany()

        res.status(200).json({
            success: true,
            message: 'Conversations deleted successfully',
            data: null
        })

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })

    }
}


