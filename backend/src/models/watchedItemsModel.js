
import pool from "../config/db.js";

const WatchedModel = {
  async toggle(userId, item) {
    try {
      const existing = await pool.query(
        'SELECT * FROM watched_items WHERE user_id = $1 AND item_id = $2',
        [userId, item.id]
      );

      if (existing.rows.length > 0) {
        if (existing.rows[0].status === item.status) {
          await pool.query(
            'DELETE FROM watched_items WHERE user_id = $1 AND item_id = $2',
            [userId, item.id]
          );
          return null; 
        } else {
        
          const { rows } = await pool.query(
            'UPDATE watched_items SET status = $1 WHERE user_id = $2 AND item_id = $3 RETURNING *',
            [item.status, userId, item.id]
          );
          return rows[0];
        }
      } else {
        // Insert new item
        const { rows } = await pool.query(
          'INSERT INTO watched_items (user_id, item_id, type, status, poster_path, title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [userId, item.id, item.type, item.status, item.poster, item.title]
        );
        return rows[0];
      }
    } catch (error) {
      console.error("Database query error in toggle:", error);
      throw error;
    }
  }
};

export default WatchedModel;