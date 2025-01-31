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