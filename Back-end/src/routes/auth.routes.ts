import { Router } from "express"
import { register, login, refreshToken, logout } from "../controllers/auth.controller.js"
import { registerValidator, loginValidator } from "../validators/auth.validator.js"
import handleValidationErrors from "../validators/handleValidationErrors.js"
const router = Router();

router.post("/register", registerValidator, handleValidationErrors, register);
router.post("/login", loginValidator, handleValidationErrors, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;