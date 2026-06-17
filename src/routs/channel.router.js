import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { CreateChannelController, getMessagesListFromChannelController, SendMessageToChannelController } from "../controllers/channel-controllers.js";

const ChannelRouter = Router()

//crear canal, chequear que el usuario qeu quiera crear un canal este incluido como miembro de wokspace
ChannelRouter.post("/:workspace_id", authMiddleware, CreateChannelController)

// Enviar Mensajes
ChannelRouter.post("/:channel_id/messages", authMiddleware, SendMessageToChannelController)

//solicitar los mensajes, para mostrarlo en el fronted
ChannelRouter.get("/:channel_id/messages", authMiddleware, getMessagesListFromChannelController)

export default ChannelRouter

