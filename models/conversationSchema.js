import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    }]
},
    { timestamps: true }
)

const conversationModel = mongoose.model('conversation', conversationSchema)

export default conversationModel