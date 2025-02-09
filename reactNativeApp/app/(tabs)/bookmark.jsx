import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL, DELETE_BOOKMARK_URL } from '@env';
import starIcon from "../../assets/star.png";
import dotIcon from "../../assets/dot.png";
import bookmark from "../../assets/bookmark.png";
import { useFocusEffect } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import { getWatched, toggleWatched } from '../../services/watchedServices.jsx';

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [moreInfo, setMoreInfo] = useState(false);
  const [isMovieWatched, setIsMovieWatched] = useState(false);
  const [seriesStatus, setSeriesStatus] = useState(null);
  const [seriesDetails, setSeriesDetails] = useState(null);

  // Use useCallback so fetchBookmarks isn’t re-created on every render.
  const fetchBookmarks = useCallback(async () => {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) return;
    try {
      const response = await axios.get(`${BASE_URL}/bookmarks/${userId}`);
      // Reverse or sort if needed
      setBookmarks(response.data.bookmarks.reverse());
    } catch (error) {
      console.error("Bookmark fetch error:", error);
    }
  }, []);

  // You may want to refresh only on mount or on pull-to-refresh rather than on every focus.
  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [fetchBookmarks])
  );

  const handleRemoveBookmark = async (bookmark) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      await axios.post(`${DELETE_BOOKMARK_URL}`, {
        user_id: userId,
        title: bookmark.data.title || bookmark.data.name,
        type: bookmark.type,
      });
      
      setBookmarks(prev => prev.filter(b => b.bookmark_id !== bookmark.bookmark_id));
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
    }
  };

  const loadWatchedStatus = async (itemId, type) => {
    try {
      const watched = await getWatched();
      if (type === 'movies') {
        setIsMovieWatched(watched.some(m => m.item_id === itemId));
      } else {
        const entry = watched.find(s => s.item_id === itemId);
        setSeriesStatus(entry?.status || null);
      }
    } catch (error) {
      console.error("Watched status error:", error);
    }
  };

  // Fetch the details (and watched status) only once when a bookmark is pressed.
  const handleBookmarkPress = async (bookmark) => {
    setSelectedBookmark(bookmark);
    setMoreInfo(true);
    setSeriesDetails(null);
    await loadWatchedStatus(bookmark.data.id, bookmark.type);

    if (bookmark.type === 'series') {
      try {
        const response = await axios.get(`${BASE_URL}/api/tmdb/series/${bookmark.data.id}`);
        setSeriesDetails(response.data);
      } catch (error) {
        console.error("Series details error:", error);
      }
    }
  };

  const handleWatchedToggle = async (newStatus) => {
    try {
      const status = selectedBookmark.type === 'movies' ? 'watched' : newStatus;
      if (selectedBookmark.type === 'movies') {
        setIsMovieWatched(prev => !prev);
      } else {
        setSeriesStatus(prev => (prev === newStatus ? null : newStatus));
      }
      
      const result = await toggleWatched({
        id: selectedBookmark.data.id,
        type: selectedBookmark.type,
        poster: selectedBookmark.data.poster,
        status: status,
      });

      if (!result?.removed) {
        const updatedWatched = await getWatched();
        if (selectedBookmark.type === 'movies') {
          setIsMovieWatched(updatedWatched.some(m => m.item_id === selectedBookmark.data.id));
        } else {
          const entry = updatedWatched.find(s => s.item_id === selectedBookmark.data.id);
          setSeriesStatus(entry?.status || null);
        }
      }
    } catch (error) {
      console.error("Error in handleWatchedToggle:", error);
    }
  };

  const movieBookmarks = useMemo(() => bookmarks.filter(b => b.type === "movies"), [bookmarks]);
  const seriesBookmarks = useMemo(() => bookmarks.filter(b => b.type === "series"), [bookmarks]);

  return (
    <View className="bg-slate-900 h-full pt-12">
      <Text className="text-3xl text-white pl-8 pb-1">Your Movies</Text>
      {movieBookmarks.length === 0 ? (
        <Text className="text-white text-center pt-4 pb-10">No movie bookmarks</Text>
      ) : (
        <FlatList
          data={movieBookmarks}
          horizontal
          keyExtractor={(item) => item.bookmark_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleBookmarkPress(item)} className="w-[200px] p-2">
              <View className="border border-cyan-800 rounded-xl p-2 bg-slate-800">
                <Image source={{ uri: item.data.poster }} className="w-full h-72 rounded-lg" />
                <Text className="text-white mt-2">{item.data.title}</Text>
                <View className="flex-row items-center mt-2">
                  <Image source={starIcon} className="w-4 h-4" tintColor="orange" />
                  <Text className="text-white ml-2">{item.data.rating?.toFixed(1)}</Text>
                  <Image source={dotIcon} className="w-1 h-1 mx-2" tintColor="white" />
                  <Text className="text-white">{item.data.releaseYear}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <Text className="text-3xl text-white pl-8 pb-1 mt-3">Your Series</Text>
      {seriesBookmarks.length === 0 ? (
        <Text className="text-white text-center pt-4">No series bookmarks</Text>
      ) : (
        <FlatList
          data={seriesBookmarks}
          horizontal
          keyExtractor={(item) => item.bookmark_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleBookmarkPress(item)} className="w-[200px] p-2">
              <View className="border border-cyan-800 rounded-xl p-2 bg-slate-800">
                <Image source={{ uri: item.data.poster }} className="w-full h-72 rounded-lg" />
                <Text className="text-white mt-2">{item.data.title}</Text>
                <View className="flex-row items-center mt-2">
                  <Image source={starIcon} className="w-4 h-4" tintColor="orange" />
                  <Text className="text-white ml-2">{item.data.rating?.toFixed(1)}</Text>
                  <Image source={dotIcon} className="w-1 h-1 mx-2" tintColor="white" />
                  <Text className="text-white">{item.data.releaseYear}</Text>
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
                <Image source={starIcon} className="w-6 h-6" resizeMode="contain" tintColor={"orange"} />
                <Text className="text-white ml-2">{selectedBookmark.data.rating?.toFixed(1)}</Text>
                <Image source={dotIcon} className="w-2 h-2 mx-2" tintColor={"white"} />
                <Text className="text-white">{selectedBookmark.data.releaseYear}</Text>
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
              <Text className="text-white text-xl mt-4 font-semibold">Overview</Text>
              <Text className="text-white text-md">{selectedBookmark.data.overview}</Text>

              {selectedBookmark.type === "series" && (
                <>
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
                  <Text className="text-white text-md">
                    Airing: {seriesDetails?.air_years || "N/A"}
                  </Text>
                  <Text className="text-white text-md">
                    Last episode was on: {seriesDetails?.last_air_date || "N/A"}
                  </Text>
                  {seriesDetails?.status === "Ended" && (
                    <Text className="text-red-400 mt-2 text-center text-lg">
                      This show has ended
                    </Text>
                  )}
                </>
              )}

              {selectedBookmark.type === "movies" ? (
                <TouchableOpacity onPress={() => handleWatchedToggle()} className="mt-4 p-2 bg-gray-700 rounded-lg">
                  <Text className={`text-lg text-center ${isMovieWatched ? "text-green-400" : "text-white"}`}>
                    {isMovieWatched ? "✓ Watched" : "Mark as Watched"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="mt-2 space-y-2">
                  <View className="flex-row gap-2 mt-2">
                    {seriesDetails?.status === "Ended" ? (
                      <>
                        <TouchableOpacity onPress={() => handleWatchedToggle("watching")} className="mx-auto">
                          <Text className={`text-white text-center flex-1 p-2 rounded-lg ${seriesStatus === "watching" ? "bg-blue-500" : "bg-gray-600"}`}>
                            {seriesStatus ? "Currently Watching" : "Are you watching ?"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleWatchedToggle("completed")} className="mx-auto">
                          <Text className={`text-white text-center p-2 rounded-lg ${seriesStatus === "completed" ? "bg-green-500" : "bg-gray-700"}`}>
                            {seriesStatus ? "✓ Completed" : "Mark Completed"}
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity onPress={() => handleWatchedToggle("watching")} className="mx-auto">
                        <Text className={`text-white text-center flex-1 p-2 rounded-lg ${seriesStatus === "watching" ? "bg-blue-500" : "bg-gray-600"}`}>
                          {seriesStatus ? "Currently Watching" : "Are you currently watching this series?"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              <View className="flex-row justify-between mt-12 pb-10">
                <TouchableOpacity onPress={() => handleRemoveBookmark(selectedBookmark)}>
                  <Image source={bookmark} className="w-10 h-10" tintColor="orange" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMoreInfo(false)} className="bg-orange-400 px-4 py-2 rounded-lg">
                  <Text className="text-white text-lg">Close</Text>
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
