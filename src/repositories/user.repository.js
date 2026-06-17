import User from "../models/User.model.js";
import { ServerError } from "../utils/error.utils.js";

class UserRepository {
    async create({username,email,password,verification_token}){
        try{
            await User.create({username, email,password,verification_token})
        }
        catch(error){
            if(error.code === 1100){
                throw new ServerError("email aready registred", 400)
            }
            throw error
        }
        
    }

    async VerifyUserByEmail(email){
    const user_found = await User.findOne({email: email})
    if(!user_found){
            throw new ServerError("usuario not found", 404 )
        }
        if(user_found.verified){
            throw new ServerError("user has already been verified", 400)
        }
        user_found.verified = true
        await user_found.save()
    return user_found
}

    async findUserByEmail(email){
        return await User.findOne({email: email})
    }

    async changeUserPassword(id, newPassword){
        const foundUser = await User.findById(id)
        if(!foundUser) throw new ServerError("User not found", 404)
        foundUser.password = newPassword
        await foundUser.save()
    }

}





export default new UserRepository()