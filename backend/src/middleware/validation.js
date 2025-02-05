
// validation function to check if user inputs are populated
export const validateUserInput = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email  || !password){
        return res.status(400).json({ error: "Every field is required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters "});
    }

    next();
}

// validation function to check if bookmark fields are populated
export const validateBookmark = (req, res, next) => {
    const { user_id, type, data } = req.body;

    if (!user_id || !type || !data) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    next();
};

// validation function to check if preferences fields are populated
export const validatePreferences = (req, res, next) =>{
    const {user_id, name, moods, genres, type} = req.body;

    if (!user_id || !name || !moods || !genres || !type){
        return res.status(400).json({message: "Missing required fields"})
    }

    next();
}