import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("invalid username"),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("invalid email"),
  body("role")
  .optional()
    .trim()
    .notEmpty()
    .isIn(['admin', 'user', 'viewer'])
    .withMessage("invalid role must be (admin, user, viewer)"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("invalid password min length 8")
]
export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("invalid email"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("invalid password min length 8")
]