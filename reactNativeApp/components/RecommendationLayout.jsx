import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, Modal, FlatList, ScrollView } from "react-native";
import starIcon from "../assets/star.png";
import dotIcon from "../assets/dot.png";
import bookmark from "../assets/bookmark.png";
import axios from "axios";
import { INSERT_BOOKMARK_URL, DELETE_BOOKMARK_URL, BASE_URL } from "@env";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';


const RecommendationLayout = ({ 
  id, 
  title, 
  poster, 
  genres, 
  rating, 
  releaseYear, 
  overview, 
  name, 
  recommendationType 
}) => {

  // State management
  const [moreInfo, setMoreInfo] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userId, setUserId] = useState("");
  const [seriesDetails, setSeriesDetails] = useState(null);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        setUserId(userId);
        await fetchBookmarks(userId);
      }
    };
    loadUserData();
  }, [ fetchBookmarks]);

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/bookmarks/${userId}`);
      const isBookmarked = response.data.bookmarks.some(
        b => b.data.title === (title || name) && b.type === recommendationType
      );
      setIsBookmarked(isBookmarked);
    } catch (error) {
      console.error("Bookmark fetch error:", error);
    }
  }, [title, name, recommendationType]);

  // Handle bookmark toggle
  const handleBookmarkPress = async () => {
    try {
      const endpoint = isBookmarked ? DELETE_BOOKMARK_URL : INSERT_BOOKMARK_URL;
      await axios.post(endpoint, {
        user_id: userId,
        title: title || name,
        type: recommendationType,
        ...(!isBookmarked && {
          data: { title: title || name, poster, genres, rating, releaseYear, overview, id}
        })
      });
      
      setIsBookmarked(!isBookmarked);
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: `Bookmark ${isBookmarked ? 'removed' : 'added'} successfully ✅`,
      });
    } catch (error) {
      console.error("Bookmark error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update bookmark",
      });
    }
  };


  // Load series details when needed
  useEffect(() => {
    if (recommendationType === 'series' && moreInfo && id) { 
      const fetchSeriesDetails = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/tmdb/series/${id}`);
          setSeriesDetails(response.data); 
        } catch (error) {
          console.error("Series details error:", error);
        }
      };
      fetchSeriesDetails();
    }
  }, [id, moreInfo, recommendationType]);


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
            <Text className="text-white ml-2">{rating?.toFixed(1)}</Text>
            <Image
              source={dotIcon}
              className="w-1 h-1 mx-2"
              tintColor={"white"}
            />
            <Text className="text-white">{releaseYear}</Text>
          </View>
        </TouchableOpacity>

        <Modal visible={moreInfo} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black/80 p-6">
            <ScrollView className="bg-gray-900 p-6 rounded-lg w-full">
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
                <Text className="text-white ml-2">{rating?.toFixed(1)}</Text>
                <Image
                  source={dotIcon}
                  className="w-2 h-2 mx-2"
                  tintColor={"white"}
                />
                <Text className="text-white">{releaseYear}</Text>
              </View>

              <Text className="text-white text-xl mt-4 mb-2 font-semibold">Genres</Text>
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

              <Text className="text-white text-xl mt-4 mb-1 font-semibold">Overview</Text>
              <Text className="text-white text-md">{overview}</Text>

              {recommendationType === "series" && (
                <View className="mt-2 space-y-2">
                    <Text className="text-white text-xl mt-4 mb-1 font-semibold">Stats</Text>
                  <Text className="text-white text-md">
                    Seasons: {seriesDetails?.seasons || "N/A"}
                  </Text>
                  <Text className="text-white text-md">
                    Episodes: {seriesDetails?.episodes || "N/A"}
                  </Text>
                  <Text className="text-white text-md">
                    Status: {seriesDetails?.status || "N/A"}
                  </Text>
                  <Text className="text-white text-md ">
                    Airing: {seriesDetails?.air_years || "N/A"}
                  </Text>
                  <Text className="text-white text-md ">
                    Last episode was on: {seriesDetails?.last_air_date || "N/A"}
                  </Text>

                  
                    

                  {seriesDetails?.status === "Ended" && (
                    <Text className="text-red-400 mt-2 text-center text-lg">
                      This show has ended
                    </Text>
                  )}
                </View>
              )}

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
    </>
  );
};

export default RecommendationLayout;
