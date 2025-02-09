import axios from 'axios';
import { BASE_URL } from "@env";
import * as SecureStore from 'expo-secure-store';

export const getWatched = async () => {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    const response = await axios.get(`${BASE_URL}/media/watched`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching watched items:", error);
    return [];
  }
};

export const toggleWatched = async (item) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const response = await axios.post(`${BASE_URL}/media/watched/toggle`, {
        ...item,
        userId
      });
      return response.data;
    } catch (error) {
      console.error("Toggle watched error:", error);
      throw error;
    }
  };