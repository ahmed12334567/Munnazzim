import { Router } from "express";
import { addInvitation } from "../controllers/invitation.controller.js";
import { handleValidation } from "../validators/handleValidationErrors.js";
import { createInvitation } from "../validators/invitation.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js"
const router = Router();

router.post("/:project_id", authenticate, createInvitation, handleValidation, addInvitation);


export default router;