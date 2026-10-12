import { Router } from "express"
import { register, login, refreshToken, logout } from "../controllers/auth.controller.js"
import { registerValidator, loginValidator } from "../validators/auth.validator.js"
import { handleValidation } from "../validators/handleValidationErrors.js"
const router = Router();

router.post("/register", registerValidator, handleValidation, register);
router.post("/login", loginValidator, handleValidation, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;