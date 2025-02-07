import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import React from 'react'


const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.container}
      className={`${containerStyles} 
                  ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
        
      <Text className={`text-black font-semibold text-xl ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "orange",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 62,
        margin: "auto",
        maxWidth: "100%"

    }
})

export default CustomButton