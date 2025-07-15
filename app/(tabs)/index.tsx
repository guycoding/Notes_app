import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
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
    </View>
  );
}
