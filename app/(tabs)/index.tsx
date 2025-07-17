import { useAuth } from "@/lib/auth-context";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { database, DATABASE_ID, HABBITS_ID } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { useState } from "react";
export default function Index() {
  const [habbits,setHabbits] = useState<Habit[]>()
  const fetchHabbits = async () => {
    try {
      const response = await database.listDocuments(DATABASE_ID, HABBITS_ID,[Query.equal("user_id",user?.$id ?? "")]);
    } catch (error) {
      console.log("error");
    }
  };
  const { signOut,user } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link
        href="/login"
        style={{
          width: 100,
          backgroundColor: "red",
          borderRadius: 5,
          textAlign: "center",
          fontSize: 16,
        }}
      >
        {" "}
        login
      </Link>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button mode="text" onPress={signOut} icon={"logout"}>
        {" "}
        Sign out
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({});
