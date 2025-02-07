import React, {useState, useEffect} from "react";
import { View, Image, Text, FlatList, ScrollView, TouchableOpacity } from "react-native";
import * as SecureStore from 'expo-secure-store';
import {BASE_URL} from "@env"
import axios from "axios";
import { Alert } from "react-native";
import handleLogout from "../(auth)/logout";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const Profile = () => {
  const [user, setUser] = useState("U");
  const [email, setEmail] = useState("email");

  useEffect(() => {
        const getUserData = async () => {
          const name = await SecureStore.getItemAsync("userName");
          const email = await SecureStore.getItemAsync("userEmail")
          if (name && email) {
            setUser(name);
            setEmail(email);
          }
        };
  
        getUserData();
      }, []);

  const [bookmarks, setBookmarks] = useState([]);

  
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

  useFocusEffect(
      useCallback(() => {
        fetchBookmarks();
      }, [])
    );

  // Get initials
  const initials = user ? user.charAt(0).toUpperCase() : "U";

  // Get recently added bookmarks
  const sortedBookmarks = bookmarks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const recentBookmarks = sortedBookmarks.slice(0, 5);

  // Get favorite genres
  const genreCounts = {};
  bookmarks.forEach((bookmark) => {
    bookmark.data.genres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });
  const favoriteGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);

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
    <ScrollView className="bg-slate-900 h-full pt-16">
      <View className="items-center mt-6">
        <View className="w-24 h-24 rounded-2xl bg-cyan-700 items-center justify-center">
          <Text className="text-white text-4xl font-semibold">{initials}</Text>
        </View>
        <Text className="text-white text-2xl mt-4 font-semibold">{user}</Text>
        <Text className="text-gray-400 ">{email}</Text>
      </View>

      <View className="flex-row justify-around mt-8">
        <View className="items-center">
          <Text className="text-white text-2xl">
            {bookmarks.filter((b) => b.type === "movies").length}
          </Text>
          <Text className="text-gray-400 font-semibold">Movies</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-2xl">
            {bookmarks.filter((b) => b.type === "series").length}
          </Text>
          <Text className="text-gray-400 font-semibold">Series</Text>
        </View>
      </View>

      <View className="mt-8">
        <Text className="text-white text-xl pl-4 pb-2 font-semibold">
          Recently Added
        </Text>
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
        <Text className="text-white text-xl pl-4 pb-2 font-semibold">
          Favorite Genres
        </Text>
        {favoriteGenres.length > 0 ? (
          <FlatList
            horizontal
            data={favoriteGenres}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="mr-2 ml-1">
                <Text className="text-white bg-gray-700 px-3 py-1 rounded-full">
                  {item}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text className="text-gray-400 pl-4 mt-2">
            Add more to your bookmarks
          </Text>
        )}
      </View>

      <TouchableOpacity
        className="bg-orange-400 p-4 mt-20 rounded-2xl w-[150px] mx-auto"
        onPress={confirmLogout}
      >
        <Text className="text-black text-center font-semibold text-xl">
          Log Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;