import nodemailer from "nodemailer"
import ENVIROMENT from "../config/enviroment.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: ENVIROMENT.GMAIL_USERNAME,
        pass: ENVIROMENT.GMAIL_PASSWORD
    }
})

export const sendEmail = async ({to, subject, html}) =>{
    const response = await transporter.sendMail({
        to,
        subject,
        html
    })
    console.log(response)
}