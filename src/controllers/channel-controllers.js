import channelRepository from "../repositories/channel.repository.js"
import messageRepository from "../repositories/menssage.repository.js"

export const CreateChannelController = async (req,res) => {
    try{
        const {name} = req.body //nombre del canal 
        const user_id = req.user._id // id del usurio q quiere crear canal
        const {workspace_id} = req.params //workspace al que quiero añadir el canal


        const new_channel = await channelRepository.CreateChannel({name, user_id, workspace_id})
        res.json({
            ok:true,
            status: 200,
            message:"channel created",
            data:{
                new_channel
            }
        })

    }
    catch (error){
        console.log("error al crear canal", error)

        if(error.status){
            return res.send({
                ok: false,
                status: error.status,
                message: error.message
            })
        }
        res.send({
        status: 500,
        ok: false,
        message:"internal server error"
    })
    }
}

export const SendMessageToChannelController = async (req,res) =>{
    try{
        const {channel_id} = req.params
        const user_id = req.user._id
        const {content} = req.body

        const new_message = await messageRepository.create({sender_id: user_id, channel_id, content})
        res.json({
            ok: true,
            message: "message created",
            status: 201,
            data:{
                new_message
            }
        })
    }
    catch (error){
        console.log("error al enviar mensage al canal", error)

        if(error.status){
            return res.send({
                ok: false,
                status: error.status,
                message: error.message
            })
        }
        res.send({
        status: 500,
        ok: false,
        message:"internal server error"
    })
    }
}

export const getMessagesListFromChannelController = async(req, res) =>{
    try{
        const user_id = req.user._id
        const {channel_id} = req.params
        const message = await messageRepository.findMessagesFromChannel({channel_id,  user_id })
        res.json({
            ok: true,
            message: "Messages found",
            status: 200,
            data: {
                message
            }
        })
    }
    catch (error){
        console.log("error al obtener lista de mensajes", error)

        if(error.status){
            return res.send({
                ok: false,
                status: error.status,
                message: error.message
            })
        }
        res.send({
        status: 500,
        ok: false,
        message:"internal server error"
    })
    }
} 