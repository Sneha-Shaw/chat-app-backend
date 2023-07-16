import messageModel from '../models/messageSchema.js';
import userModel from '../models/userSchema.js';
import conversationModel from "../models/conversationSchema.js";

// @desc    send message
// @route   POST /send/message
// @access  Private
export const sendMessage = async (request) => {
    try {

        const { senderId, receiverId, message } = request

        const sender = await userModel.findById(senderId)
        const receiver = await userModel.findById(receiverId)

        if (!sender || !receiver) {
            return {
                success: false,
                message: 'Sender or receiver not found',
                data: null
            }
        }

        const conversation = await conversationModel.findOne({
            users: {
                $all: [senderId, receiverId]
            }
        })

        if (!conversation) {
            return {
                success: false,
                message: 'Conversation not found',
                data: null
            }
        }

        const newMessage = new messageModel({
            user: senderId,
            message,
            conversation: conversation._id
        })

       

        await newMessage.save()

        conversation.messages.push(newMessage._id)

        await conversation.save()

        // populate user field in message

        const updated = await newMessage.populate('user')




        return {
            success: true,
            message: 'Message sent successfully',
            data: updated,
            users: [senderId, receiverId]
        }




    } catch (error) {

        return {
            success: false,
            message: 'Internal server error',
            data: null
        }

    }
}

// @desc    get messages by conversation id
// @route   GET /get/messages/:id
// @access  Private
export const getMessages = async (request) => {
    try {

        const { id } = request.params

        const conversation = await conversationModel.findById(id).populate({
            path: 'messages',
            populate: {
                path: 'user',
                select: 'name'
            }
        })

        if (!conversation) {
            return {
                success: false,
                message: 'Conversation not found',
                data: null
            }
        }

        return {
            success: true,
            message: 'Messages fetched successfully',
            data: conversation.messages
        }

    } catch (error) {

        return {
            success: false,
            message: 'Internal server error',
            data: null
        }

    }
}


// @desc   delete all messages
// @route  DELETE /delete/messages
// @access Private
export const deleteAllMessages = async (req, res) => {
    try {

        await messageModel.deleteMany()

        res.status(200).json({
            success: true,
            message: 'Messages deleted successfully',
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

// @desc   delete message by id
// @route  DELETE /delete/message/:id
// @access Private
export const deleteMessageById = async (req, res) => {
    try {

        const { id } = req.params

        const message = await messageModel.findById(id)

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message not found',
                data: null
            })
        }

        await messageModel.findByIdAndDelete(id)

        // delete in conversation

        const conversation = await conversationModel.findById(message.conversation)

        if (!conversation) {
            return res.status(400).json({
                success: false,
                message: 'Conversation not found',
                data: null
            })
        }

        conversation.messages = conversation.messages.filter((msg) => msg.toString() !== id)

        await conversation.save()

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully',
            data: null
        })


    } catch (error) {

    }
}