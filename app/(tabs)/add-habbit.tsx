import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, SegmentedButtons, TextInput, useTheme,Text } from "react-native-paper";
import { useAuth } from "@/lib/auth-context";
import { database, DATABASE_ID, HABBITS_ID } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import { useRouter } from "expo-router";

const FREQUENCIES = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQUENCIES)[number];
const addHabbitScreen = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error,setError] = useState<string | null>(null)
  const { user } = useAuth();
  const router = useRouter()
  const theme = useTheme()
  const handleSubmit = async () => {
    if (!user) return;
    try{
    await database.createDocument(DATABASE_ID, HABBITS_ID, ID.unique(), {
      user_id: user.$id,
      title: title,
      description:description,
      frequency:frequency,
      streak_count: 0,
      last_completed: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    router.back();}catch(error){
        if(error instanceof Error){
            setError(error.message)
            return
        }
        setError("there was an error creating habbit")

    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="tittle"
        mode="outlined"
        style={styles.input}
        onChangeText={setTitle}
      />
      <TextInput
        label="Description"
        mode="outlined"
        style={styles.input}
        onChangeText={setDescription}
      />
      <View style={styles.frequenciesContainer}>
        <SegmentedButtons
          value={frequency}
          onValueChange={(value) => setFrequency(value as Frequency)}
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
        />
      </View>
      <Button onPress={handleSubmit} mode="contained">
        add habbit
      </Button>
      {error  && <Text style={{ color: theme.colors.error }}>{error}</Text>}
    </View>
  );
};

export default addHabbitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f4",
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
  },
  frequenciesContainer: {
    marginBottom: 24,
  },
});
