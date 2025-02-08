import WatchedModel from '../models/watchedItemsModel.js';

export const toggleWatched = async (req, res) => {
    try {
      const { userId, id, type, title, poster, status } = req.body;
      console.log("Received toggle request:", { userId, id, type, title, poster, status });
  
      const result = await WatchedModel.toggle(userId, {
        id,
        type,
        title,
        poster,
        status
      });
  
      if (result === null) {
        console.log("Item removed from watched list");
        res.json({ removed: true });
      } else {
        console.log("Toggle result from model:", result);
        res.json(result);
      }
    } catch (error) {
      console.error("Error in toggleWatched controller:", error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  };
  
  export const getWatched = async (req, res) => {
    try {
      const userId = req.query.userId;
      const items = await WatchedModel.getForUser(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch watched items' });
    }
  };