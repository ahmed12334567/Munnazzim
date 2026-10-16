import { body, param } from "express-validator";

export const createInvitation = [
    param("project_id")
        .isUUID(4).withMessage("project id must be a uuid").bail(),
    body("email")
        .notEmpty().withMessage("email is required").bail()
        .isEmail().withMessage("email must be a email fromate").bail()
        .trim()
        .withMessage("invalid email"),
    body("role")
        .isString().withMessage("role must be a string").bail()
        .default("member")
        .trim()
        .isIn(['admin', 'member', 'viewer']).withMessage("invalid role must be (admin, user, viewer)").bail(),
]