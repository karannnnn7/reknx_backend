import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createPortfolio, getAllPortfolio, updatePortfolio,deletePortfolio } from "../controller/portfolio.controller.js";
import {upload} from '../middlewares/multer.middlewares.js'

const router= Router()

router.route('/all-portfolio').get(getAllPortfolio)
router.route('/update/:id').patch(verifyJWT, upload.fields([{name: "img", maxCount: 1}]),updatePortfolio)
router.route('/create').post(verifyJWT, upload.fields([{name: "img", maxCount: 1}]),createPortfolio)
router.route('/delete/:id').delete(verifyJWT,deletePortfolio)

export default router