import ENVIROMENT from "../config/enviroment.js"
import { ServerError } from "../utils/error.utils.js"
import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) =>{
    try{
        const authorization_header = req.headers["authorization"]
    if(!authorization_header){
        throw new ServerError("no has proporcinado un header de athorizacion", 401)
    }
    const authorization_token = authorization_header.split(" ")[1]
    if(!authorization_token){
        throw new ServerError("no has proporcinado un token de athorizacion", 401)
    }
    try{
        const user_info = jwt.verify(authorization_token, ENVIROMENT.SECRET_KEY_JWT)
        req.user = user_info
        next()
    }catch(error){
        throw new ServerError("token invalido o vencido", 400)
    }
    
    }catch(error){
        console.log(error)
        if(error.status){
            return res.send({
                ok:false,
                status: error.status,
                message: error.message
            })
        }
        return res.send({
            message: "Internal server error",
            status: 500,
            ok: true
        })
    }
    
}