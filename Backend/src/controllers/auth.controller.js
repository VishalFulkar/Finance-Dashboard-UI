const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const uploadFile = require("../services/stoarge.service")

async function authRegistrationController(req, res) {
    try {

        const { email, password, name } = req.body;

        if (!email || !password || !name || !req.file) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const isExist = await userModel.findOne({
            email: email
        })

        if (isExist) {
            return res.status(422).json({
                message: "User already exists!",
                status: "failed"
            })
        }

        const result = await uploadFile(req.file.buffer);

        const user = await userModel.create({
            email,
            password,
            name,
            avatar: result.url
        })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" })

        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role
            },
            message: "User created successfully",
            status: "success"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
            status: "failed"
        })
    }
}

async function authLoginController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                status: "failed"
            })
        }

        const user = await userModel.findOne({
            email: email
        }).select("+password +role")

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: "failed"
            })
        }

        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
                status: "failed"
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" })
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role
            },
            message: "User logged in successfully",
            status: "success"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: "failed"
        })
    }
}

async function authLogoutController(req, res) {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        })
        return res.status(200).json({
            message: "User logged out successfully",
            status: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "failed"
        })
    }
}

async function getMeController(req, res) {
    // req.user is already set by authMiddleware with role included
    return res.status(200).json({
        user: {
            _id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            avatar: req.user.avatar,
            role: req.user.role
        },
        status: "success"
    })
}

module.exports = { authRegistrationController, authLoginController, authLogoutController, getMeController }