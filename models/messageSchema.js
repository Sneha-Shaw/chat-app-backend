import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation',
        required: true
    }

},
    { timestamps: true }
)

const messageModel = mongoose.model('message', messageSchema)

export default messageModel