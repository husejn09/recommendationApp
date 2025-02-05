import pool from "../config/db.js";

// Function to create a new user in DB
export const createUser = async (name, email, hashPassword) => {
    const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`
    
    const values = [name, email, hashPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Function to find user in DB by email
export const getUserByEmail = async (email) => {
    const query = `
        SELECT * FROM users
        WHERE email = $1;
    `;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Add these functions to handle refresh tokens
// Update saveRefreshToken to handle multiple devices:
export const saveRefreshToken = async (userId, token) => {
    const query = `
        INSERT INTO refresh_tokens (user_id, token)
        VALUES ($1, $2)
    `;
    await pool.query(query, [userId, token]);
};

export const getRefreshToken = async (token) => {
    const query = 'SELECT * FROM refresh_tokens WHERE token = $1';
    const result = await pool.query(query, [token]);
    return result.rows[0];
};

export const deleteRefreshToken = async (token) => {
    const query = 'DELETE FROM refresh_tokens WHERE token = $1';
    await pool.query(query, [token]);
};