import { User } from "../models/user.model.js"

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const giveUserToken = await User.findById(userId)
        const accessToken = giveUserToken.generateAccessToken()
        const refreshToken = giveUserToken.generateRefreshToken()

        giveUserToken.refreshToken = refreshToken
        await giveUserToken.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log("failed to generate token : ", error.message);

    }
}

const createUser = async (req, res) => {
    try {
        const { name, password, role } = req.body
        if (!name || !password || !role) {
            return res.status(400).json({ success: false, message: 'all fileds are required' })
        }
        const user = await User.create({
            name: name,
            password: password,
            role: role
        })
        if (!user) {
            return res.status(500).json({ success: false, message: 'failed to create user' })
        }
        const createdUser = await User.find(user._id).select('-password -refershToken')
        return res.status(200).json({ success: true, message: 'user created', data: createdUser })
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

const loginUser =
    async (req, res) => {
        const { name, password } = req.body
        if (!name || !password) {
            return res.status(400).json({ success: false, message: 'all fileds are required' })
        }
        const user = await User.findOne({ name }).select('+password')
        if (!user) {
            return res.status(500).json({ success: false, message: 'failed to find user' })
        }
        const isPasswordValid = await user.isPassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'password is invalid' })
        }
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
        const loggedInUser = await User.findById(user._id).select("-password -refershToken")

        const options = { // help to not modify the cookies 
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        }
        console.log("process.env.MONGODB_URL app.js == ", process.env.MONGODB_URL);

        res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({ success: true, message: "user logged In done", data: loggedInUser, accessToken, refreshToken })
    }

const logout = async (req, res) => {
    await User.findByIdAndUpdate( // update the token
        req.user._id,
        {

            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = { // not alloed to modify the cookies
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({ success: true, message: 'user loged out' })
}
export {
    loginUser,
    createUser,
    logout
}