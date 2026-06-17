import ENVIROMENT from "./config/enviroment.js";
import express from "express"
import authRouter from "./routs/auth-router.js";
import mongoose from "./config/mongoDB.config.js";
import { sendEmail } from "./utils/mailer.util.js";
import cors from "cors"
import { authMiddleware } from "./middlewares/authMiddleware.js";
import workspace_router from "./routs/workspace.router.js";
import ChannelRouter from "./routs/channel.router.js";




const app = express()

/* app.use(cors(
    {
        origin: ENVIROMENT.URL_FRONTEND
    }
)) */
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/workspaces", workspace_router)
app.use("/api/channels", ChannelRouter)

app.get("/api/test/comprar", authMiddleware, (req, res) =>{
    console.log(req.user)
    res.json({
        message: "producto comprado"
    })
}) 




/* app.get("/api/test/comprar", authMiddleware, (req,res) =>{
    res.json({
        message: "producto comprado"
    })
}) */
/* sendEmail({
    to: "urielramirez665@gmail.com",
    html: "<h1>hola desde node js</h1>",
    subject: "probando"
})
 */

app.listen(ENVIROMENT.PORT, () =>{
    console.log(`el servidor se escucha en http://localhost:${ENVIROMENT.PORT}`)
})

