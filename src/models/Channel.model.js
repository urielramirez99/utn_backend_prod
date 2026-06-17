import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        workspace:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace"
        },
        created_at:{
            type: Date,
            default: Date.now
        },
        created_by:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
)

const Channel = mongoose.model("Channel", ChannelSchema)

export default Channel