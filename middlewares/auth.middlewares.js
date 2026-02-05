import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            return res.status(401).json({success: false,message:"Unautorized Access"})
        }
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
        if (!user) {
            return res.status(401).json({success: false,message:"user not found"})
        }
    
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({success: false,message:"invalid access token catch block : "})
    }

}

export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                error: `User role '${req.user.role}' is not authorized to performe this task in this route`
            });
        }
        next();
    };
};