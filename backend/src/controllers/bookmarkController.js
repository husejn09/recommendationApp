import { getBookmark, insertBookmark, deleteBookmark, getAllBookmarksByUser } from "../models/bookmarkModel.js"

// Insert bookmarks
export const createBookmark = async (req, res) => {
    const {user_id, type, data} = req.body;

    try {
        console.log("Received request data:", req.body);
        const existingBookmark = await getBookmark(user_id, data.title, type);
        if(existingBookmark){
            return res.status(400).json({ message: "Bookmark with that name already exists"});
        }

        await insertBookmark(user_id, type, data);

        res.status(201).json({ message: "Bookmark was created sucessfully"});

    } catch (error) {
        console.error("Error in createBookmark:", error);
        res.status(500).json({ error: error.message});
    }
}

// Remove bookmark 
export const removeBookmark = async (req, res) => {
    const {user_id, title, type} = req.body;

    try {
        const existingBookmark = await getBookmark(user_id, title, type);
        if(existingBookmark){
            await deleteBookmark(user_id, title, type);
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