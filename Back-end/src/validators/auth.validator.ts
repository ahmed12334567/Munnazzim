import { body } from "express-validator";


const NAME_MIN = 3;
const NAME_MAX = 100;

export const registerValidator = [
  body("username")
    .isString().withMessage("username must be a string").bail()
    .trim()
    .notEmpty().withMessage("name is required").bail()
    .isLength({ min: NAME_MIN, max: NAME_MAX })
    .withMessage(`username must be between ${NAME_MIN} and ${NAME_MAX} characters`),
  body("email")
    .notEmpty().withMessage("email is required").bail()
    .isEmail().withMessage("email must be a email fromate").bail()
    .trim()
    .withMessage("invalid email"),
  body("role")
    .optional()
    .trim()
    .isIn(['admin', 'user', 'viewer']).withMessage("invalid role must be (admin, user, viewer)").bail(),
  body("password")
    .notEmpty().withMessage("password is required").bail()
    .trim()
    .isLength({ min: 8 })
    .withMessage("invalid password min length 8")
]
export const loginValidator = [
  body("email")
    .notEmpty().withMessage("email is required").bail()
    .isEmail().withMessage("email must be a email fromate").bail()
    .trim()
    .withMessage("invalid email"),
  body("password")
    .notEmpty().withMessage("password is required").bail()
    .trim()
    .isLength({ min: 8 })
    .withMessage("invalid password min length 8")
]