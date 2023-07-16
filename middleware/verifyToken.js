import jwt from 'jsonwebtoken'
import env from 'dotenv'

env.config()

// verifyToken
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        console.log(token);
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token'
                })
            }
            else {
                console.log(user);
                req.user = user
                next()
            }
        })
    }
    else {
        return res.status(401).json({
            success: false,
            message: 'Token not found'
        })
    }
}
