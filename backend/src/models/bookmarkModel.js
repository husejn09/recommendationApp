import pool from "../config/db.js";

export const insertBookmark = async(user_id, type, data) => {
    const query = `INSERT INTO bookmarks (user_id, type, data) VALUES ($1, $2, $3) RETURNING *`;

    const values = [user_id, type, data];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const deleteBookmark = async(user_id, title, type) => {
    const query = `DELETE FROM bookmarks WHERE user_id = $1 AND data->>'title' = $2 AND type= $3 RETURNING *`;

    const values = [user_id, title, type]; 
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const getBookmark = async(user_id, title, type) => {
    const query = `SELECT * FROM bookmarks WHERE user_id = $1 AND data->>'title' = $2 AND type = $3`;

    const values = [user_id, title, type];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const getAllBookmarksByUser = async (user_id) => {
    const query = `SELECT * FROM bookmarks WHERE user_id = $1`;
    const values = [user_id];
    const result = await pool.query(query, values);
    return result.rows;
};