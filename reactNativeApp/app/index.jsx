import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import "../global.css"
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import cardsImage from "../assets/mainImage.png"
import logo from "../assets/logo.png"
import CustomButton from '../components/CustomButton';
import AuthLoading from '../components/AuthLoading';

export default function App() {
  return (
  <>
    <SafeAreaView className="bg-slate-900 flex-1">
        <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', height: "100%" }}>
          <View className="w-full items-center px-4 min-h-[84vh] ">
            <View className="flex flex-row items-center mb-6">
              <Image 
              source={logo}
              className="w-[150px] h-[120px] -ml-12 "
              resizeMode='contain'
              /> 
              <Text className="text-4xl text-white -ml-10">Recomm App</Text>
            </View>
            <Image 
              source={cardsImage}
              className="max-w-[350px] w-full h-[300px]"
              resizeMode='contain'
            />

            <View className="relative mt-5">
              <Text className="text-3xl text-white font-bold text-center px-4">
                Best recommendation for You by
                <Text className="text-orange-400"> Recomm</Text>
              </Text>
            </View>

            <Text className="text-white px-2 text-md text-center mt-7">Find the best recommendations for movies and TV series based on your mood and genres you preffer</Text>
            <CustomButton 
              title="Continue to app"
              handlePress={() => router.push("/signin")}
              containerStyles="w-full mt-7"
            />
          </View>
        </ScrollView>

    </SafeAreaView>
  </>
  );
}

