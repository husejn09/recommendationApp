import { getBookmark, insertBookmark, deleteBookmark, getAllBookmarksByUser } from "../models/bookmarkModel.js"

// Insert bookmarks
export const createBookmark = async (req, res) => {
    const {user_id, type, name, data} = req.body;

    try {
        const existingBookmark = await getBookmark(user_id, name);
        if(existingBookmark){
            return res.status(400).json({ message: "Bookmark with that name already exists"});
        }

        const newBookmark = await insertBookmark(user_id, type, name, data);

        res.status(201).json({bookmark: newBookmark});

    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

// Remove bookmark 
export const removeBookmark = async (req, res) => {
    const {user_id, name} = req.body;

    try {
        const existingBookmark = await getBookmark(user_id, name);
        if(existingBookmark){
            await deleteBookmark(user_id, name);
            return res.status(201).json({ message: "Bookmark was deleted sucessfully"})
        } else {
            return res.status(400).json({message: "That bookmark does not exist, no deletion has been done."})
        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getAllBookmarks = async (req, res) => {
    const { user_id } = req.params;

    try {
        const bookmarks = await getAllBookmarksByUser(user_id);
        res.status(200).json({ bookmarks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};