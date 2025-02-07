import { View, Text, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'

const ChooseButton = ({item, handlePress, additonalStyle, isActive}) => {
  console.log("Button:", item, "isActive:", isActive);
  return (
    <TouchableOpacity
      className={` ${isActive ? 'opacity-75 ' : 'bg-orange-400'} ${additonalStyle}`}
      onPress={handlePress}
    >
      <Text className={`font-semibold text-center text-xl ${isActive ? "text-white opacity-90 " : "text-black"}`}>{item}</Text>
    </TouchableOpacity>
  );
};

export default ChooseButton