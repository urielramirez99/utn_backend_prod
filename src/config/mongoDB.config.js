import mongoose from "mongoose";
import ENVIROMENT from "./enviroment.js";

const connectToMongoDB = async () =>{
    try{
        const response = await mongoose.connect(ENVIROMENT.MONGO_DB_URL)
        console.log("conexion exitosa con MongoDB")
    }
    catch(error){
        console.log("Ocurrio un error al conectarse a MongoDB", error)
    }
}

connectToMongoDB()

export default mongoose