import { Stack, Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
export default function TabsLayout() {
  return(
    <Tabs screenOptions={{tabBarActiveTintColor:"blue"}}>
      <Tabs.Screen name="index" options ={{title:"Home",tabBarIcon:({focused})=>{
        if(focused){
          return(
            <Ionicons name="home" size={24} color="black" />
          )
        }else{
          return <Ionicons name="home-outline" size={24} color="black" />
        }
      } }}/> 
      <Tabs.Screen name="login" options ={{title:"login"}}/> 
    </Tabs>
  )
}
