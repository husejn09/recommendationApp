import WatchedModel from '../models/watchedItemsModel.js';

export const toggleWatched = async (req, res) => {
    try {
      const userId = req.body.userId;
      const item = req.body;
      const result = await WatchedModel.toggle(userId, item);
      res.json(result);
    } catch (error) {
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