import mongoose from "mongoose";
import Message from "../models/Message.model.js";
import { ServerError } from "../utils/error.utils.js";
import channelRepository from "./channel.repository.js";
import workspaceRepository from "./workspace.repository.js";

class MessageRepository {


    async create({sender_id, channel_id, content }) {

        //chequear que exista el canal
        const channel_found = await channelRepository.findChannelById(channel_id)
        if(!channel_found){
            throw new ServerError("Channel not found", 404)
        }

        //chequear que el usuario pertenezca al workspace
        const workspace_found = await workspaceRepository.findWorkspaceById(channel_found.workspace)
        if (!workspace_found.members.includes(sender_id)){
            throw new ServerError("User is not member of this workspace", 403)
        }
        
        //Creamos el mensage
        const new_message = await Message.create({
            sender: sender_id,
            channel: channel_id,
            content
        })
        return new_message
    }

    async findMessagesFromChannel ({channel_id, user_id }){
        
        const channel_found = await channelRepository.findChannelById(channel_id)
        console.log("workspace members:", channel_found.workspace.members)
        console.log("user_id:", user_id)
        console.log(
        "comparison:",
        channel_found.workspace.members.map(m => m.toString())
)
        if(!channel_found){
            throw new ServerError("Channel not found", 404)
        }

        if(!channel_found.workspace.members.includes(user_id)){
            throw new ServerError("User is not member of this workspace")
        }

        const messages_list = await Message.find({channel: channel_id}).populate("sender", "username email")
        return messages_list
        }

    }


const messageRepository = new MessageRepository()
export default messageRepository