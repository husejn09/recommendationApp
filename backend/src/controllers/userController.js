import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { createUser, getUserByEmail } from "../models/userModel.js";

dotenv.config();

// Register new user
export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {

        const existingUser = await getUserByEmail(email);
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        // hashing the password
        const hashPassword = await bcrypt.hash(password, 10);

        // create a new user with createUser function from userModel
        const newUser = await createUser(name, email, hashPassword);

        const token = jwt.sign({userId: newUser.user_id}, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        res.status(201).json({ user: newUser, token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        // call the function getUserByEmail from userModels and find the user by email
        const user = await getUserByEmail(email);
        if(!user){
            return res.status(404).json({ error: "User not found"})
        }
        
        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            return res.status(401).json({ error: "Invalid password"});
        } 

        const token = jwt.sign({userId: user.user_id}, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};