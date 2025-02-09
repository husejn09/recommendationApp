import { View, Text, FlatList, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import RecommendationLayout from './RecommendationLayout';
import axios from "axios";
import { MOVIES, SERIES } from '@env';
import Toast from 'react-native-toast-message';
import { Animated } from 'react-native';

const ChooseOptions = ({ recommendationType}) => {
  // Data and loading states
  const [dataFromAPI, setDataFromAPI] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showRecomm, setShowRecomm] = useState(false);

  // Genre selection state
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // List of genres 
  const moviesGenres = [{id: 28, name: "Action"},
    {id: 12, name: "Adventure"},
    {id: 16, name: "Animation"},
    {id: 35, name: "Comedy"},
    {id: 80, name: "Crime"},
    {id: 99, name: "Documentary"},
    {id: 18, name: "Drama"},
    {id: 10751, name: "Family"},
    {id: 14, name: "Fantasy"},
    {id: 36, name: "History"},
    {id: 27, name: "Horror"},
    {id: 9648, name: "Mystery"},
    {id: 10749, name: "Romance"},
    {id: 878, name: "Sci-Fi"},
    {id: 53, name: "Thriller"},
    {id: 10752, name: "War"},
    {id: 37, name: "Western"}]

  const seriesGenres = [
    {id: 10759, name: "Action"},
    {id: 16, name: "Animation"},
    {id: 35, name: "Comedy"},
    {id: 80, name: "Crime"},
    {id: 99, name: "Documentary"},
    {id: 18, name: "Drama"},
    {id: 10751, name: "Family"},
    {id: 10762, name: "Kids"},
    {id: 9648, name: "Mystery"},
    {id: 10763, name: "News"},
    {id: 10764, name: "Reality"},
    {id: 10765, name: "Sci-Fi"},
    {id: 10766, name: "Soap"},
    {id: 10767, name: "Talk"},
    {id: 10768, name: "War & Politics"},
    {id: 37, name: "Western"}]

    let genres = null;
  // "All" is represented as id 'null'
  if (recommendationType === "series"){
     genres = [{ id: null, name: 'Random/All' }, ...seriesGenres];
  } else {
     genres = [{ id: null, name: 'Random/All' }, ...moviesGenres];
  }
  
  
  // set the id of genre to send it to api and set the genre name for display in app, modal is no visible unless pressed
  const handleSelect = (genre) => {
    setSelectedGenre(genre.id);
    setSelectedDisplay(genre.name);
    setModalVisible(false);
    // reset the button
    setIsSearching(false);
  };

  // handle scroll into generated recommendations const flatListRef = useRef(null);

  
  // main function to get data from the api in the backend based on what user choosed
  const fetchRecommendations = async () => {
    if (isSearching) return; 
    setIsSearching(true);
    setLoading(true);

    const url = recommendationType === "series" ? SERIES : MOVIES;
    try {

      const response = await axios.post(
        url,
        { genre: selectedGenre }
      );
      // Extract the movies (or series) from the response
      if(recommendationType === "series"){
        setDataFromAPI(response.data.series);
      } else if (recommendationType === "movies") {
        setDataFromAPI(response.data.movies);
      }
      else{
      }
    } catch (error) {

    } finally {
        Toast.show({
            type: "success",
            text1: "Success!",
            text2: `✅ Scroll down to see recommendations `,
          });
        setShowRecomm(true);
      setLoading(false);
    }
  };
  
  return (
    <>
      <Text className="text-center text-2xl text-white mt-10 font-semibold">
        What could you watch today?
      </Text>
      <Text className="text-white text-2xl font-semibold">
        <Text className="text-orange-400 text-2xl font-semibold">Choose</Text>{" "}
        genres below
      </Text>

      <View className="flex-row mt-6 gap-10 pb-20">
        <View className="items-center justify-center">
          <TouchableOpacity
            className="px-4 py-2 bg-orange-400 rounded-lg w-[130px]"
            onPress={() => setModalVisible(true)}
          >
            <Text className="font-bold text-lg text-center">
              {selectedDisplay || "Select Genre"}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View className="flex-1 justify-center items-center bg-black/50">
                <TouchableWithoutFeedback>
                  <View className="bg-gray-800 w-[200px] rounded-lg p-4">
                    <FlatList
                      data={genres}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          className="p-3 border-b border-gray-600"
                          onPress={() => handleSelect(item)}
                        >
                          <Text className="text-white">{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

        <TouchableOpacity
          className={`h-[40px] w-[130px] justify-center items-center rounded-xl ${
            isSearching ? "bg-orange-400 opacity-50" : "bg-orange-400"
          }`}
          onPress={fetchRecommendations}
          disabled={isSearching}
        >
          <Text className="font-semibold text-xl">Search</Text>
        </TouchableOpacity>
      </View>

      {showRecomm && (
        <FlatList
          className={"bg-slate-900 bg-gradient-to-b p-2"}
          data={dataFromAPI}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <RecommendationLayout
              {...item}
              recommendationType={recommendationType}
            />
          )}
        />
      )}
    </>
  );
};

export default ChooseOptions;
