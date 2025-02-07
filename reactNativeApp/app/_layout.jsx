import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import { Stack } from 'expo-router'
import Toast from 'react-native-toast-message';
import AuthLoading from '../components/AuthLoading';

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AuthLoading />

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
      < Toast
      />
    </>
  );
}

export default RootLayout