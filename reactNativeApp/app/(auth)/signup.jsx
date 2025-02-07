// SignUp.js
import React, { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import logo from "../../assets/logo.png";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { Link, router } from 'expo-router';
import api from '../../components/axios';

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

// Update submit handler in SignUp.js
const submit = async () => {
  setIsSubmitting(true);
  try {
      const response = await api.post('/users/register', {
          name: form.name,
          email: form.email,
          password: form.password
      });

      const { user, token, refreshToken } = response.data;
      
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('userId', user.user_id.toString());

      router.replace("/home");
  } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(message); // Add proper error display
  } finally {
      setIsSubmitting(false);
  }
};
  

  return (
    <SafeAreaView className="bg-slate-900 h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', marginTop: -50, height: "100%" }} keyboardShouldPersistTaps="handled">
        <View className="w-full px-4 my-4 justify-center">
          <View className="flex-row items-center justify-center">
            <Image 
              source={logo}
              className="w-[170px] h-[170px]"
              resizeMode='contain'
            />
          </View>
          <Text className="text-2xl text-white font-semibold text-center">
            Sign up to <Text className="text-orange-400"> Recomm</Text>
          </Text>
          <FormField 
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-7"
            styleText="text-base text-gray-100 font-medium"
          />
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            styleText="text-base text-gray-100 font-medium"
            keyboardType="email-address"
          />
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="default"
            secureTextEntry
          />
          <CustomButton 
            title="Sign Up"
            handlePress={submit}
            containerStyles="w-full mt-7"
            isLoading={isSubmitting}
          />   
          <View className="justify-center pt-5 flex-row gap-2"> 
            <Text className="text-lg text-gray-100 font-light">
              Already have an account?
            </Text>
            <Link href="/signin" className='text-lg font-semibold text-orange-400'>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
