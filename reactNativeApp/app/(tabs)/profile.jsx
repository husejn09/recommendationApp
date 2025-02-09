import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Image, Text, FlatList, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from "@env";
import axios from "axios";
import handleLogout from "../(auth)/logout";
import { getWatched } from '../../services/watchedServices.jsx';

const Profile = () => {
  const [user, setUser] = useState("U");
  const [email, setEmail] = useState("email");
  const [bookmarks, setBookmarks] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchedSeries, setWatchedSeries] = useState([]); // COMPLETED series
  const [currentlyWatchingSeries, setCurrentlyWatchingSeries] = useState([]); // Series marked as watching
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const name = await SecureStore.getItemAsync("userName");
      const email = await SecureStore.getItemAsync("userEmail");
      if (name && email) {
        setUser(name);
        setEmail(email);
      }
    };
    getUserData();
  }, []);

  const fetchBookmarks = async () => {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) return;
    try {
      const response = await axios.get(`${BASE_URL}/bookmarks/${userId}`);
      setBookmarks(response.data.bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const loadWatchedData = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) return;
      const watched = await getWatched(userId);
      const validWatched = watched.filter(item => item.item_id != null);
      setWatchedMovies(validWatched.filter(i => i.type === "movies"));
      setWatchedSeries(validWatched.filter(i => i.type === "series" && i.status === "completed"));
      setCurrentlyWatchingSeries(validWatched.filter(i => i.type === "series" && i.status === "watching"));
    } catch (error) {
      console.error("Error loading watched data:", error);
    }
  };

  const loadData = useCallback(async () => {
    await fetchBookmarks();
    await loadWatchedData();
  }, []);

  // Load data only once when the component mounts.
  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, [loadData]);

  // Memoize the sorted bookmarks and favorite genres.
  const sortedBookmarks = useMemo(() => {
    return [...bookmarks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [bookmarks]);

  const recentBookmarks = useMemo(() => sortedBookmarks.slice(0, 5), [sortedBookmarks]);

  const genreCounts = useMemo(() => {
    const counts = {};
    bookmarks.forEach(bookmark => {
      bookmark.data.genres.forEach(genre => {
        counts[genre] = (counts[genre] || 0) + 1;
      });
    });
    return counts;
  }, [bookmarks]);

  const favoriteGenres = useMemo(() => {
    return Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre]) => genre);
  }, [genreCounts]);

  const confirmLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: handleLogout, style: "destructive" }
      ]
    );
  };

  return (
    <ScrollView
      className="bg-slate-900 h-full pt-16"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="items-center mt-6">
        <View className="w-24 h-24 rounded-2xl bg-cyan-700 items-center justify-center">
          <Text className="text-white text-4xl font-semibold">{user.charAt(0).toUpperCase()}</Text>
        </View>
        <Text className="text-white text-2xl mt-4 font-semibold">{user}</Text>
        <Text className="text-gray-400 ">{email}</Text>
      </View>
      <View className="flex-row justify-around mt-8">
        <View className="items-center">
          <Text className="text-white text-2xl">{bookmarks.filter(b => b.type === "movies").length}</Text>
          <Text className="text-gray-400 font-semibold">Movies</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-2xl">{bookmarks.filter(b => b.type === "series").length}</Text>
          <Text className="text-gray-400 font-semibold">Series</Text>
        </View>
      </View>
      <View className="mt-8">
        <Text className="text-white text-xl pl-4 pb-2 font-semibold">Recently Added</Text>
        <FlatList
          data={recentBookmarks}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.bookmark_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity className="m-2">
              <Image
                source={{ uri: item.data.poster }}
                className="w-36 h-52 rounded-lg"
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <View className="mt-8">
        <Text className="text-white text-xl pl-4 pb-2 font-semibold">Favorite Genres</Text>
        {favoriteGenres.length > 0 ? (
          <FlatList
            horizontal
            data={favoriteGenres}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="mr-2 ml-1">
                <Text className="text-white bg-gray-700 px-3 py-1 rounded-full">{item}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text className="text-gray-400 pl-4 mt-2">Add more to your bookmarks</Text>
        )}
      </View>
      <View className="mt-8">
        <Text className="text-white text-xl pl-4 pb-2 font-semibold">Watched Content</Text>
        {(watchedMovies.concat(watchedSeries)).length > 0 ? (
          <FlatList
            horizontal
            data={watchedMovies.concat(watchedSeries)}
            keyExtractor={(item) => item?.item_id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View className="m-2">
                <Image
                  source={{ uri: item?.poster_path || "fallback_image_url" }}
                  className="w-36 h-52 rounded-lg"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        ) : (
          <Text className="text-gray-400 pl-4 mt-2">No watched content yet</Text>
        )}
      </View>
      <View className="mt-8">
        <Text className="text-white text-xl pl-4 pb-2 font-semibold">Currently Watching</Text>
        {currentlyWatchingSeries.length > 0 ? (
          <FlatList
            horizontal
            data={currentlyWatchingSeries}
            keyExtractor={(item) => item?.item_id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View className="m-2">
                <Image
                  source={{ uri: item?.poster_path || "fallback_image_url" }}
                  className="w-36 h-52 rounded-lg"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        ) : (
          <Text className="text-gray-400 pl-4 mt-2">Not currently watching anything</Text>
        )}
      </View>
      <TouchableOpacity
        className="bg-orange-400 p-4 mt-8 mb-20 rounded-2xl w-[150px] mx-auto"
        onPress={confirmLogout}
      >
        <Text className="text-black text-center font-semibold text-xl">Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
