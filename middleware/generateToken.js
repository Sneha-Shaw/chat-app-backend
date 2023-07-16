import jwt from 'jsonwebtoken'
import env from 'dotenv'

env.config()

// generate token
export const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        mobile: user.mobile
    }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

