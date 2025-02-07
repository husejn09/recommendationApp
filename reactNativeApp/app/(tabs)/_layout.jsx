import { View, Text } from 'react-native'
import React from 'react'
import {Tabs, Redirect} from "expo-router"
import homeIcon from "../../assets/home.png"
import profileIcon from "../../assets/circle-user.png"
import bookmarkIcon from "../../assets/bookmark.png"
import { Image } from 'react-native'

const TabIcon = ({icon, color, name, focused}) => {
  return (
    <View className="flex mt-6 items-center justify-center w-20 gap-1 ">
        <Image
          source={icon}
          resizeMode='contain'
          tintColor={color}
          className="w-6 h-6"
        />
        <Text className={`text-white ${focused ? "font-semibold" : "font-normal"}`}>{name}</Text>
    </View>
  )
}


const TabsLayout = () => {
  return (
   <>
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "rgb(15 23 42)",
          borderTopWidth: 0,
          borderTopColor: "red",
          height: 75
        }
      }}
    >
      <Tabs.Screen 
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused}) => (
            <TabIcon 
              icon={homeIcon}
              color={color}
              name="Home"
              focused={focused}
            />
          )
        }}
      />

      <Tabs.Screen 
        name="bookmark"
        options={{
          title: "Bookmark",
          headerShown: false,
          tabBarIcon: ({ color, focused}) => (
            <TabIcon 
              icon={bookmarkIcon}
              color={color}
              name="Bookmark"
              focused={focused}
            />
          )
        }}
      />

      <Tabs.Screen 
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused}) => (
            <TabIcon 
              icon={profileIcon}
              color={color}
              name="Profile"
              focused={focused}
            />
          )
        }}
      />

      
    </Tabs>
   </>
  )
}

export default TabsLayout