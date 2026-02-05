import { Router } from "express";
import { createUser, getCurrentUser, loginUser, logout } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/register").post(createUser)

router.route("/login").post(loginUser)

router.route('/logout').post(verifyJWT, logout)

router.route("/me").get(verifyJWT, getCurrentUser);


export default router