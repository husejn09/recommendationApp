import pool from "../config/db.js";

export const insertBookmark = async(user_id, type, name, data) => {
    const query = `INSERT INTO bookmarks (user_id, type, name, data) VALUES ($1, $2, $3, $4) RETURNING *`;

    const values = [user_id, type, name, data];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const deleteBookmark = async(user_id, name) => {
    const query = `DELETE FROM bookmarks WHERE user_id = $1 AND name = $2`

    const values = [user_id, name]; 
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const getBookmark = async(user_id, name) => {
    const query = `SELECT * FROM bookmarks WHERE user_id = $1 AND name = $2`;

    const values = [user_id, name];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const getAllBookmarksByUser = async (user_id) => {
    const query = `SELECT * FROM bookmarks WHERE user_id = $1`;
    const values = [user_id];
    const result = await pool.query(query, values);
    return result.rows;
};