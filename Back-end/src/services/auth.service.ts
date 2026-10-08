import userRepo from "../repositories/user.repository.js"
import bcrypt from "bcrypt"
import type { User } from '../types/user.types.js'
import { generateToken } from "../utils/jwt.js"

export const createUser = async (data: User) => {
    const { username, email, password, role } = data;
    const existUser = await userRepo.findUserByEmail(email);
    if (existUser) {
        return {
            status: "fail",
            message: "Email already exists",
            code: "EMAIL_ALREADY_EXISTS"
        }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userRepo.createUser({
        username,
        email,
        password: hashedPassword,
        role
    });

    const accessToken = generateToken({
        id: user.id,
        email,
        username: username!
    });

    return {
        status: "success",
        message: "create account successfully",
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
            role
        },
        accessToken
    }
}

export const loginUser = async (data: User) => {
    const { email, password } = data;

    const findUser = await userRepo.findUserByEmail(email);

    if (!findUser) {
        return {
            status: "fail",
            message: "Email not found",
            code: "EMAIL_NOT_FOUND"
        }
    }
    
    const comparePasswords = await bcrypt.compare(password, findUser.password);

    if (!comparePasswords) {
        return {
            status: "fail",
            message: "worng password",
            code: "WORNG_PASSWORD"
        }
    }

    const accessToken = generateToken({
        id: findUser.id,
        email,
        username: findUser.username
    });

    return {
        status: "success",
        message: "login successfully",
        data: {
            id: findUser.id,
            username: findUser.username,
            email: findUser.email,
            role: findUser.role
        },
        accessToken
    }
}