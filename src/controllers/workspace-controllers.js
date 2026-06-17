import workspaceRepository from "../repositories/workspace.repository.js"

export const createWorkspace = async (req, res) => {
    try{
        const {name} = req.body
        const owner_id = req.user._id
        const new_workspace = await workspaceRepository.createWorkspace({name, owner_id})
        
        res.json({
            ok: true,
            status: 201,
            message: "Workspace Created",
            data: {
                new_workspace
            }
        })
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

export const inviteUserToWorkspaceController = async (req, res) =>{
    try{
        const user_id = req.user._id
        const { invited_id, workspace_id } = req.params
        const workspace_found = await workspaceRepository.addNewMember({owner_id: user_id, invited_id, workspace_id})
        res.json(
            {
                ok:true,
                status: 201,
                message: "New member",
                data: {
                    workspace: workspace_found
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