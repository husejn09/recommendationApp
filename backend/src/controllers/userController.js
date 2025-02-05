import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { createUser, getUserByEmail, saveRefreshToken, deleteRefreshToken, getRefreshToken } from "../models/userModel.js";

dotenv.config();

// Register new user
export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const existingUser = await getUserByEmail(email);
        if(existingUser) return res.status(400).json({message: "User already exists"});

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(name, email, hashPassword);

        // Generate both tokens like in login
        const token = jwt.sign({userId: newUser.user_id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        const refreshToken = jwt.sign(
            { userId: newUser.user_id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "30d" }
        );

        await saveRefreshToken(newUser.user_id, refreshToken);

        res.status(201).json({ 
            user: newUser, 
            token,
            refreshToken // Add refresh token to response
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Updated loginUser function
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        const genericError = "Invalid email or password";

        if (!user) return res.status(401).json({ error: genericError });
        
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(401).json({ error: genericError });

        // Generate tokens
        const token = jwt.sign(
            { userId: user.user_id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "30d" }
        );

        // Store refresh token in DB
        await saveRefreshToken(user.user_id, refreshToken);

        res.status(200).json({ 
            user, 
            token, 
            refreshToken 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Updated refreshTokenHandler
export const refreshTokenHandler = async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token missing" });
    }

    try {
        // Verify token and check DB
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await getRefreshToken(refreshToken);
        
        if (!storedToken) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        // Generate new tokens
        const newAccessToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const newRefreshToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "30d" }
        );

        // Update refresh token in DB
        await deleteRefreshToken(refreshToken);
        await saveRefreshToken(payload.userId, newRefreshToken);

        res.status(200).json({ 
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        res.status(403).json({ error: "Invalid refresh token" });
    }
};

// Add logout handler
export const logoutUser = async (req, res) => {
    const { refreshToken } = req.body;
    
    try {
        await deleteRefreshToken(refreshToken);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};