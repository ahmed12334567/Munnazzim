import { body } from "express-validator";

const NAME_MIN = 3;
const NAME_MAX = 100;
const DESC_MIN = 20;
const DESC_MAX = 1000;

export const projectValidation = [
    body("name")
        .isString().withMessage("name must be a string").bail()
        .trim()
        .notEmpty().withMessage("name is required").bail()
        .isLength({ min: NAME_MIN, max: NAME_MAX })
        .withMessage(`name must be between ${NAME_MIN} and ${NAME_MAX} characters`),
    body("description")
        .isString().withMessage("description must be a string").bail()
        .trim()
        .notEmpty().withMessage("description is required").bail()
        .isLength({ min: DESC_MIN, max: DESC_MAX })
        .withMessage(`description must be between ${DESC_MIN} and ${DESC_MAX} characters`),
]