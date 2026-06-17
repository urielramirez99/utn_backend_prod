import { Router } from "express";
import { createWorkspace, inviteUserToWorkspaceController } from "../controllers/workspace-controllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";



const workspace_router = Router()

workspace_router.post("/", authMiddleware, createWorkspace )

workspace_router.post("/:workspace_id/invite/:invited_id", authMiddleware, inviteUserToWorkspaceController)

export default workspace_router


