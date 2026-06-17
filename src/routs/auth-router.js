import express from "express"
import { loginController, registerUser, resetPasswordController, rewritePasswordController, verifyemailController } from "../controllers/auth-controllers.js"


const authRouter = express.Router()

authRouter.post("/register", registerUser)
authRouter.get("/verify-email", verifyemailController) 
authRouter.post("/login", loginController)
authRouter.post("/reset-password", resetPasswordController)
authRouter.put("/rewrite-password", rewritePasswordController)

export default authRouter