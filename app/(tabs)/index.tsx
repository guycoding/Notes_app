import { useAuth } from "@/lib/auth-context";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  const {signOut} = useAuth()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/login" style={{width:100, backgroundColor:"red", borderRadius: 5, textAlign:"center",fontSize:16}}> login</Link>
      <Text>Edit app/index.tsx to edit this screen.</Text>
       <Button mode="text" onPress={signOut} icon={"logout"}> Sign out</Button>
    </View>
  );
}
