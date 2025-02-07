import api from '../../components/axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router'; 

const handleLogout = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    if (refreshToken) {
      await api.post('/users/logout', { refreshToken });
    }

    // Clear all user-related data from SecureStore
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userId');

    router.replace('/signin');
  } catch (error) {
    console.error('Logout failed:', error);

    alert('Logout failed. Please try again.');
  }
};

export default handleLogout;