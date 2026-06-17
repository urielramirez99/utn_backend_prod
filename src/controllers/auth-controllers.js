import { ServerError } from "../utils/error.utils.js"
import UserRepository from "../repositories/user.repository.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ENVIROMENT from "../config/enviroment.js"
import { sendEmail } from "../utils/mailer.util.js"
import userRepository from "../repositories/user.repository.js"


export const registerUser = async (req,res) => {
    try{
        const {username, email, password} = req.body

        if(!username){
            throw new ServerError("username is required", 400)
        }
        if(!email){
            throw new ServerError("email is required", 400)
        }
        if(!password){
            throw new ServerError("password is required", 400)
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const verification_token = jwt.sign(
            {email}, /* lo que queremos guardar en el token */
            ENVIROMENT.SECRET_KEY_JWT, /*clave con la que vamos a firmar */
            {expiresIn: "24h"}) /*fecha de expiracion del token */


        await UserRepository.create({username,email,password: passwordHash ,verification_token})

        await sendEmail({
            to:email,
            subject:"valida tu mail",
            html: `<h1>Valida tu mail paraentrar en nuestra pagina</h1>
            <p>estaes validacion para asegurarnos que tu mail es realmente tuyo</p>
            <a href="${ENVIROMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}">
                Verificar cuenta
            </a>
            `
        })

        return res.send({
            message: "user created",
            status: 201,
            ok: true
        })
    } catch (error){
        console.log("error al registrar", error)

        if(error.status){
            return res.send(error)
        }
        res.send({
        status: 500,
        ok: false,
        message:"internal server error"
    })
    }
}

export const verifyemailController = async (req,res) =>{
    try{
        const {verification_token} = req.query
        const payload = jwt.verify(verification_token, ENVIROMENT.SECRET_KEY_JWT)
        const {email} = payload
        const user_found = await UserRepository.VerifyUserByEmail(email)
        res.redirect(ENVIROMENT.URL_FRONTEND + "/login")
        }

    catch (error){
        console.log("error al registrar", error)

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

export const loginController = async (req,res) =>{
    try{
        const {email, password} = req.body
        const user_found = await userRepository.findUserByEmail(email)
        if(!user_found){
            throw new ServerError("user not found", 404)
        }
        if(!user_found.verified){
            throw new ServerError("user found has no validated his email", 400)
        }
        const isSamePassword = await bcrypt.compare(password, user_found.password)
        if(!isSamePassword){
            throw new ServerError("the password is not correct", 400)
        }
        const authorization_token = jwt.sign(
            {
                _id: user_found._id,
                username: user_found.username,
                email: user_found.email
            },
            ENVIROMENT.SECRET_KEY_JWT,
            {expiresIn: "2h"}
        )
        res.json(
            {
                ok: true,
                status: 200,
                message:"logged",
                data:{
                    authorization_token
                }
            }
        )
    }
    catch (error){
        console.log("error al registrar", error)

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

export const resetPasswordController = async (req,res) =>{
    try{
        const {email} = req.body
        const user_found = await UserRepository.findUserByEmail(email)
        if(!user_found){
            throw new ServerError("user not found", 404)
        }
        if(!user_found.verified){
            throw new ServerError("user email is not valied", 404)
        }
        const reset_token = jwt.sign({email, _id: user_found._id}, ENVIROMENT.SECRET_KEY_JWT, {expiresIn:"2h"})
        await sendEmail({
            to: email,
            subject:"reset your password",
            html: `
            <h1>has solicitado resetear tu contraseña </h1>
            <a href="${ENVIROMENT.URL_FRONTEND}/rewrite-password?reset_token=${reset_token}">Click aqui para resetear</a>`
        })
        res.json({
            ok:true,
            status:200,
            message:"reset mail sent"
        }
        )
    }
    catch (error){
        console.log("error al registrar", error)

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

export const rewritePasswordController = async (req,res) =>{
    try{
        const {password, reset_token} = req.body
        const { _id } = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY_JWT)

        const newHashedPassword = await bcrypt.hash(password, 10)
        await UserRepository.changeUserPassword(_id, newHashedPassword)

        return res.json({
            ok:true,
            message: "password changed succesfully",
            status: 200
        })
    } catch(error){
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


