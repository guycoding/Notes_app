import { AuthProvider } from "@/lib/auth-context";
import { Background } from "@react-navigation/elements";
import { Stack,useFocusEffect,useRouter } from "expo-router";
import { useEffect, useRef } from "react";
function RoutGouard ({children}:{children: React.ReactNode}){
  const router = useRouter()
  const isAuth = false; 
  useFocusEffect(()=> {
    if(!isAuth){
        router.replace("/auth")
  } 
  });
  return <>{children}</>
}

export default function RootLayout() {
  return(
    <AuthProvider>
    <RoutGouard>
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown:false }}/>  
       <Stack.Screen name="auth" options={{headerStyle:{backgroundColor: "#f4511e"},headerTitleAlign:'center',title:"Login Page"}}   />
    </Stack>
    </RoutGouard>
    </AuthProvider>
  )
}
