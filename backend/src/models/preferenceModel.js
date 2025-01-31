import pool from "../config/db.js";

export const insertPreference = async (user_id, name, moods, genres, type) => {
    const query = `INSERT INTO user_preferences (user_id, name, moods, genres, type) VALUES ($1, $2, $3, $4, $5) RETURNING *`

    const values = [user_id, name, moods, genres, type];
    const result = await pool.query(query, values);

    return result.rows[0];
}

export const getPreferencesByUser = async (user_id, name, type) => {
    const query = `SELECT * FROM user_preferences WHERE user_id = $1 AND name = $2 AND type = $3`;

    const values = [user_id, name, type];
    const result = await pool.query(query, values);

    return result.rows[0];
}

export const deletePreferences = async (user_id, name, type) => {
    const query = `DELETE FROM user_preferences WHERE user_id = $1 AND name = $2 AND type = $3`

    const values = [user_id, name, type];
    const result = await pool.query(query, values);

    return result.rows[0];
}


export const getAllPreferencesByUserType = async (user_id, type) => {
    const query = `SELECT * FROM user_preferences WHERE user_id = $1 AND type = $2`

    const values = [user_id, type];
    const result = await pool.query(query, values);

    return result;
}