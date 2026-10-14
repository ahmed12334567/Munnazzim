import { Router } from "express";
import {handleValidation} from "../validators/handleValidationErrors.js";
import { projectValidation } from "../validators/project.validator.js";
import { addProject, project } from "../controllers/project.controller.js";
import {authenticate} from "../middlewares/auth.middleware.js"
const router = Router();

router.post("/", projectValidation, handleValidation, authenticate, addProject);
router.get("/projects", authenticate, project);

export default router;