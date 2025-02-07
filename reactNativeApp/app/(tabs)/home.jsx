import { View, Text, Image, FlatList, StatusBar } from 'react-native'
import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from "../../assets/logo.png"
import movieTV from "../../assets/movieTVv2.png"
import ChooseButton from '../../components/ChooseButton'
import ChooseOptions from '../../components/ChooseOptions'
import * as SecureStore from 'expo-secure-store';
import { BackHandler } from 'react-native';

const Home = () => {

  const [selectedOption, setSelectedOption] = useState(null);

  const handlePress = (option) => {
    setSelectedOption(option);
  };

  // handling the user name from his data from login
  const [userName, setUserName] = useState("");

    useEffect(() => {
        // Retrieve the user's name from SecureStore
        const getUserData = async () => {
            const name = await SecureStore.getItemAsync('userName');
            if (name) {
                setUserName(name); 
            }
        };

        getUserData();
    }, []);

  //handling back button so user cant exit or go back on index.jsx
  useEffect(() => {
    const backAction = () => {
        return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
  <SafeAreaView className="bg-slate-900 h-full">
      <FlatList
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6 "> 
                <View className="mt-1.5"> 
                  <Text className="font-medium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="font-semibold text-xl text-white text-center">
                    {userName ? userName : "User"}
                  </Text>
                </View>
                <View className="-mr-6 -mt-4">
                    <Image
                      source={logo}
                      className="w-28 h-24"
                      resizeMode='contain' 
                    />
                </View>
            </View>
          </View>
        )}

        ListEmptyComponent={() =>(
          <View className="justify-center items-center">
            <Image 
              source={movieTV}
              className="w-[300px] h-[280px]"
              resizeMode='contain'
            />

          <Text className="text-center font-semibold text-2xl px-4 mt-10 text-white">Choose which <Text className="text-orange-400">recommendations</Text> you want to see</Text>

          <View className="flex-row mt-16 flex-wrap gap-2">
            <ChooseButton
              isActive={selectedOption === "movies"}
              item="Movies"
              handlePress={() => handlePress('movies')}
              additonalStyle="bg-orange-400 h-[70px] w-[100px] justify-center items-center rounded-xl"
              
            />
            <ChooseButton
              isActive={selectedOption === "series"}
              item="Series"
              handlePress={() => handlePress('series')}
              additonalStyle="bg-orange-400 h-[70px] w-[100px] justify-center items-center rounded-xl "
              
            />

          </View>
          {selectedOption && <ChooseOptions recommendationType={selectedOption}/>}
        </View>
        )}  
      />
  </SafeAreaView>
  )
}

export default Home