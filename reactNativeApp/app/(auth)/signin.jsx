import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { Link, router } from 'expo-router';
import { BASE_URL } from '@env';
import logo from "../../assets/logo.png";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import api from '../../components/axios';

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      console.log("Sending request to:", `${BASE_URL}/users/login`);
      const response = await api.post(`/users/login`, {
        email: form.email.toLowerCase(),
        password: form.password,
      });

      const { user, token, refreshToken } = response.data;

      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('userId', user.user_id.toString());
      await SecureStore.setItemAsync('userName', user.name);
      await SecureStore.setItemAsync('userEmail', user.email);

      router.replace("/home");
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      setErrorMessage(message);

      // Show an alert for incorrect email or password
      Alert.alert(
        "Log In Failed",
        "Email or password is incorrect. Please try again.",
        [
          { text: "OK", onPress: () => setForm({ email: "", password: "" }) } 
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-slate-900 h-full">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          marginTop: -50,
        }}
      >
        <View className="w-full px-4 my-4 justify-center">
          <View className="flex-row items-center justify-center">
            <Image
              source={logo}
              className="w-[170px] h-[170px]"
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl text-white font-semibold text-center">
            Log in to <Text className="text-orange-400 text-3xl"> Recomm</Text>
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => setForm({ ...form, email: text })}
            otherStyles="mt-7"
            styleText="text-base text-gray-100 font-medium"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => setForm({ ...form, password: text })}
            otherStyles="mt-7"
            secureTextEntry
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="w-full mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-light">
              Don't have an account?
            </Text>
            <Link href="/signup" className="text-lg font-semibold text-orange-400">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;