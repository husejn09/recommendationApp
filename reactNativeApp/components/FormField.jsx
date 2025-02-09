import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import passwordIcon from "../assets/passwordIcon.png"

const FormField = ({title, value, placeholder, handleChangeText, otherStyles}) => {

    const [showPassword, setshowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
  return (
    <View className={` ${otherStyles}`}>
      <Text className={`mb-2 ml-1 text-base text-gray-100 font-medium`}>{title}</Text>
      <View className={`flex-row border-2 w-full h-16 px-4 bg-gray-700 rounded-2xl items-center 
                        ${isFocused ? 'border-orange-400' : 'border-gray-500'}`}>

        <TextInput className="flex-1 text-white font-semibold text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            secureTextEntry={title === "Password" && !showPassword}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            />
            
        {title === "Password" && (
            <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
                <Image 
                    source={!showPassword ? passwordIcon : passwordIcon}
                    tintColor={!showPassword ? "white" : "orange"}
                    className="w-6 h-6"
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}


        
      </View>
    </View>
  )
}


export default FormField