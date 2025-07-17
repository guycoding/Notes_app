import { Stack, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {MaterialCommunityIcons} from "@expo/vector-icons"

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#f5f5f5" },
        headerShadowVisible: false,
        tabBarStyle :{
          backgroundColor:"#f5f5f5",
          borderTopWidth: 0,
          elevation:0,
          shadowOpacity:0,
        },
        tabBarActiveTintColor:"#6200ee",
        tabBarInactiveTintColor:"#666666"
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habbits",
          tabBarIcon: ({color }) => {
              return <MaterialCommunityIcons name="calendar-today" size={24} color={color} />;
            } 
            
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",
          tabBarIcon: ({color }) => {
              return <MaterialCommunityIcons name="chart-line" size={24} color={color} />;
            } 
            
        }}
      />
      <Tabs.Screen
        name="add-habbit"
        options={{
          title: "Add Habbit",
          tabBarIcon: ({color }) => {
              return <MaterialCommunityIcons name="plus-circle" size={24} color={color} />;
            } 
            
        }}
      />
      
    </Tabs>
  );
}
