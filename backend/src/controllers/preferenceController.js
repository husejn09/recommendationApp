import express from "express";
import { insertPreference, getPreferencesByUser, deletePreferences, getAllPreferencesByUserType} from "../models/preferenceModel.js";

// Insert a user preferences 
export const createPreferences = async (req, res) => {
    const {user_id, name, moods, genres, type} = req.body;

    try {
        const existingPreferences = await getPreferencesByUser(user_id, name, type);
        
        if(!existingPreferences){
            await insertPreference(user_id, name, moods, genres, type);
            res.status(201).json({ message: "Preferences successfuly created"})
        } else {
            res.status(400).json({ message: "Preferences with that name already exists"})
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Remove user preferences

export const removePreferences = async (req, res) => {
    const {user_id, name, type} = req.body;

    try {
        const existingPreferences = await getPreferencesByUser(user_id, name, type);
        if(existingPreferences){
            await deletePreferences(user_id, name, type);
            res.status(201).json({ message: "Preferences successfuly deleted"})
        } else {
            res.status(400).json({ message: "There is no preferences with that name and type, no deletion was done"})
        }

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


export const getAllPreferences = async (req, res) => {
    const {user_id, type} = req.params;

    try {
        const preferences = await getAllPreferencesByUserType(user_id, type);
        res.status(201).json({ preferences });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
