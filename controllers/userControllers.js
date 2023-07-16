import userModel from '../models/userSchema.js'
import { generateToken } from '../middleware/generateToken.js'
import bcrypt from 'bcrypt'


// @desc    Register a new user
// @route   POST /users/register
// @access  Public
export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required',
                data: null
            })
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
                data: null
            })
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required',
                data: null
            })
        }

        // Check if user already exists
        const userExists = await userModel.findOne({ email })

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
                data: null
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        // Generate token
        const token = generateToken(user)

        // Send response
        res.status(200).json({
            success: true,
            message: 'User created successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token
            }
        })



    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
            data: null

        })

    }
}


// @desc    Login user
// @route   POST /users/login
// @access  Public
export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body

        // Check if user exists
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist',
                data: null
            })
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
                data: null
            })
        }

        // Generate token
        const token = generateToken(user)

        // Send response
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null

        })
    }
}

// get all users
export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({})

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users
        })

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null

        })
    }
}

// search user by name
export const searchUser = async (req, res) => {
    try {

        const { name } = req.body

        const users = await userModel.find({ name: { $regex: name, $options: 'i' } })

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users
        })

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null

        })
    }
}