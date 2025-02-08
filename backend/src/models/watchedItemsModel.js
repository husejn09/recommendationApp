import pool from "../config/db.js";

export const WatchedModel = {
  async getForUser(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM watched_items WHERE user_id = $1',
      [userId]
    );
    return rows;
  },

  async toggle(userId, item) {
    // Upsert operation
    const { rows } = await pool.query(`
      INSERT INTO watched_items 
        (user_id, item_id, type, status, poster_path, title)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, item_id) 
      DO UPDATE SET status = EXCLUDED.status
      RETURNING *
    `, [
      userId,
      item.id,
      item.type,
      item.status,
      item.poster,
      item.title
    ]);
    
    return rows[0];
  }
};

