import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL, DELETE_BOOKMARK_URL } from '@env';
import starIcon from "../../assets/star.png";
import dotIcon from "../../assets/dot.png";
import bookmark from "../../assets/bookmark.png";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Toast from 'react-native-toast-message'

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [moreInfo, setMoreInfo] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchBookmarks = async () => {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      console.error("User not logged in");
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/bookmarks/${userId}`);
      setBookmarks(response.data.bookmarks.reverse());
    } catch (error) {
      
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [])
  );

  const handleBookmarkPress = (bookmark) => {
    setSelectedBookmark(bookmark);
    setMoreInfo(true);
  };

  const movies = bookmarks.filter((b) => b.type === "movies");
  const series = bookmarks.filter((b) => b.type === "series");

  const handleRemoveBookmark = async (bookmark) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      console.log(userId, bookmark.data.title || bookmark.data.name, bookmark.type);
      await axios.post(`${DELETE_BOOKMARK_URL}`, {
        user_id: userId,
        title: bookmark.data.title || bookmark.data.name,
        type: bookmark.type,
      });
      
      setBookmarks((prev) => prev.filter((b) => b.bookmark_id !== bookmark.bookmark_id));
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Bookmark removed successfully ✅"
      });
      setMoreInfo(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to remove bookmark",
      });
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <View className="bg-slate-900 h-full pt-12">
    <Text className="text-3xl text-white pl-8 pb-1">Your Movies</Text>

    {movies.length === 0 ? (
      <Text className="text-white text-center pt-4 pb-10">
        You don't have any bookmarks yet.
      </Text>
    ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.bookmark_id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            style={{ maxHeight: 370 }}
          
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleBookmarkPress(item)}
                className=""
              >
                <View className="w-[200px] p-2">
                  <View className="border border-cyan-800 rounded-xl p-2 bg-slate-800">
                    <Image
                      source={{ uri: item.data.poster }}
                      className="w-full h-72 rounded-lg"
                      resizeMode="cover"
                    />
                    <Text className="text-white mt-2">
                      {item.data.title || item.data.name}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <Image source={starIcon} className="w-4 h-4" resizeMode="contain" tintColor={"orange"}/>
                      <Text className="text-white ml-2">{item.data.rating}</Text>
                      <Image source={dotIcon} className="w-1 h-1 mx-2" tintColor={"white"} />
                      <Text className="text-white">{item.data.releaseYear}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <Text className="text-3xl text-white pl-8 pb-1 mt-3">Your Series</Text>
        {series.length === 0 ? (
          <Text className="text-white text-center pt-4">You have no series bookmarked.</Text>
        ) : (
            <FlatList
              data={series}
              keyExtractor={(item) => item.bookmark_id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              style={{ maxHeight: 370 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleBookmarkPress(item)}
                  className=""
                >
                  <View className="w-[200px] p-2">
                    <View className="border border-cyan-800 rounded-xl p-2 bg-slate-800">
                      <Image
                        source={{ uri: item.data.poster }}
                        className="w-full h-72 rounded-lg"
                        resizeMode="cover"
                      />
                      <Text className="text-white mt-2">
                        {item.data.title || item.data.name}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <Image source={starIcon} className="w-4 h-4" resizeMode="contain" tintColor={"orange"}/>
                        <Text className="text-white ml-2">{item.data.rating}</Text>
                        <Image source={dotIcon} className="w-1 h-1 mx-2" tintColor={"white"} />
                        <Text className="text-white">{item.data.releaseYear}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
        )}
    

      {selectedBookmark && (
        <Modal visible={moreInfo} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black/80 p-6">
            <ScrollView className="bg-gray-900 p-6 rounded-lg w-full">
              <Image
                source={{ uri: selectedBookmark.data.poster }}
                className="w-full h-[430px] rounded-lg"
                resizeMode="cover"
              />
              <Text className="text-white text-2xl mt-4">
                {selectedBookmark.data.title || selectedBookmark.data.name}
              </Text>
              <View className="flex-row items-center mt-2">
                <Image
                  source={starIcon}
                  className="w-6 h-6"
                  resizeMode="contain"
                  tintColor={"orange"}
                />
                <Text className="text-white ml-2">
                  {selectedBookmark.data.rating}
                </Text>
                <Image source={dotIcon} className="w-2 h-2 mx-2" tintColor={"white"} />
                <Text className="text-white">
                  {selectedBookmark.data.releaseYear}
                </Text>
              </View>
              <Text className="text-white text-lg mt-4">Genres</Text>
              <FlatList
                data={selectedBookmark.data.genres}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                renderItem={({ item }) => (
                  <Text className="text-white bg-gray-700 px-2 py-1 rounded-lg mx-1">
                    {item}
                  </Text>
                )}
              />
              <Text className="text-white text-lg mt-4">Overview</Text>
              <Text className="text-white text-md">
                {selectedBookmark.data.overview}
              </Text>
              <View className="flex-row justify-between mt-12 pb-10">
                <TouchableOpacity onPress={() => handleRemoveBookmark(selectedBookmark)}>
                  <Image
                    source={bookmark}
                    className={`w-10 h-10`}
                    tintColor={"orange"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMoreInfo(false)}
                  className="bg-orange-400 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white">Close</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
      <Toast />
    </View>
  );
};

export default Bookmark;
