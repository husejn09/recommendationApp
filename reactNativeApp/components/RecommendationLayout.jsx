import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Modal, FlatList, ScrollView } from "react-native";
import starIcon from "../assets/star.png";
import dotIcon from "../assets/dot.png";
import bookmark from "../assets/bookmark.png";
import axios from "axios";
import { INSERT_BOOKMARK_URL, DELETE_BOOKMARK_URL, BASE_URL } from "@env";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

const RecommendationLayout = ({ title, poster, genres, rating, releaseYear, overview, name, recommendationType }) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      const name = await SecureStore.getItemAsync("userId");
      if (name) {
        setUserId(name);
        fetchBookmarks(name);
      }
    };

    getUserData();
  }, []);

  // function for fetching user bookmarks and keeping up with it, if the user fetches movies/series again it will know which is already bookmarked
  const fetchBookmarks = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/bookmarks/${userId}`);
      const bookmarks = response.data.bookmarks;
      const isItemBookmarked = bookmarks.some(
        (b) => b.data.title === (title || name) && b.type === recommendationType
      );
      setIsBookmarked(isItemBookmarked);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const handleBookmarkPress = async () => {
    if (isBookmarked) {
      try {
        await axios.post(`${DELETE_BOOKMARK_URL}`, {
          user_id: userId,
          title: title || name,
          type: recommendationType
        });
        setIsBookmarked(false);
        setMoreInfo(false); 
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "Bookmark removed successfully ✅",
        });
      } catch (error) {
        console.error("Error removing bookmark:", error);
      }
    } else {
      try {
        await axios.post(`${INSERT_BOOKMARK_URL}`, {
          user_id: userId,
          type: recommendationType,
          data: {
            title: title || name,
            poster,
            genres,
            rating,
            releaseYear,
            overview,
          },
        });
        setIsBookmarked(true);
        setMoreInfo(false); 
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "Bookmark added successfully ✅",
        });
      } catch (error) {
        console.error("Error adding bookmark:", error);
      }
    }
  };
  const [watched, setWatched] = useState(false);
  return (
    <>
      <View className="w-1/2 p-2">
        <TouchableOpacity
          onPress={() => setMoreInfo(true)}
          className="border border-cyan-800 rounded-xl p-2 bg-slate-800"
        >
          <Image
            source={{ uri: poster }}
            className="w-full h-72 rounded-lg"
            resizeMode="cover"
          />
          <Text className="text-white mt-2">{title || name}</Text>

          <View className="flex-row items-center mt-2">
            <Image
              source={starIcon}
              className="w-4 h-4"
              resizeMode="contain"
              tintColor={"orange"}
            />
            <Text className="text-white ml-2">{rating}</Text>
            <Image
              source={dotIcon}
              className="w-1 h-1 mx-2"
              tintColor={"white"}
            />
            <Text className="text-white">{releaseYear}</Text>
          </View>
        </TouchableOpacity>

        <Modal visible={moreInfo} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black/80 p-6 ">
            <ScrollView className="bg-gray-900 p-6 rounded-lg w-full ">
              <Image
                source={{ uri: poster }}
                className="w-full h-[430px] rounded-lg"
                resizeMode="cover"
              />
              <Text className="text-white text-3xl mt-4">{title || name}</Text>

              <View className="flex-row items-center mt-2">
                <Image
                  source={starIcon}
                  className="w-6 h-6"
                  resizeMode="contain"
                  tintColor={"orange"}
                />
                <Text className="text-white ml-2">{rating}</Text>
                <Image
                  source={dotIcon}
                  className="w-2 h-2 mx-2"
                  tintColor={"white"}
                />
                <Text className="text-white">{releaseYear}</Text>
              </View>

              <Text className="text-white text-xl mt-4 mb-2">Genres</Text>
              <FlatList
                data={genres}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                renderItem={({ item }) => (
                  <Text className="text-white bg-gray-700 px-2 py-1 rounded-lg mx-1">
                    {item}
                  </Text>
                )}
              />

              <Text className="text-white text-xl mt-4 mb-1">Overview</Text>
              <Text className="text-white text-md">{overview}</Text>

              <TouchableOpacity
                onPress={() => setWatched(!watched)}
                className="bg-gray-700 p-2 rounded-lg mt-4"
              >
                <Text className="text-white">
                  {watched ? "✓ Watched" : "Mark as Watched"}
                </Text>
              </TouchableOpacity>
              
              <View className="flex-row justify-between mt-12 pb-10">
                <TouchableOpacity onPress={handleBookmarkPress}>
                  <Image
                    source={bookmark}
                    className={`w-10 h-10`}
                    tintColor={isBookmarked ? "orange" : "white"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setMoreInfo(false)}
                  className="bg-orange-400 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white text-lg">Close</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </Modal>
      </View>
      <Toast position="bottom" bottomOffset={20} visibilityTime={1000} />
    </>
  );
};

export default RecommendationLayout;