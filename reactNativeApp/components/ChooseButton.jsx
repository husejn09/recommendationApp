import { View, Text, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'

const ChooseButton = ({item, handlePress, additonalStyle, isActive}) => {
  return (
    <TouchableOpacity
      className={` ${isActive ? 'opacity-75 ' : 'bg-orange-400'} ${additonalStyle}`}
      onPress={handlePress}
    >
      <Text className={`font-semibold text-center text-xl ${isActive ? " opacity-70 font-black" : "text-black"}`}>{item}</Text>
    </TouchableOpacity>
  );
};

export default ChooseButton