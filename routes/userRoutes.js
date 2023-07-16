import express from 'express'

import {
    registerUser,
    loginUser,
    getUsers,
    searchUser
} from '../controllers/userControllers.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/all', getUsers)
router.post('/search', searchUser)
router.get('/verifyToken', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Valid token',
        data: req.user
    })
})


export default router