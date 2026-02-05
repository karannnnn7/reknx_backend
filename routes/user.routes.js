import { Router } from "express";
import { createUser, loginUser, logout } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/register").post(createUser)

router.route("/login").post(loginUser)

router.route('/logout').post(verifyJWT,logout)


export default router