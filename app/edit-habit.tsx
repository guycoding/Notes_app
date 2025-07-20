import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, SegmentedButtons, TextInput, useTheme, Text } from "react-native-paper";
import { database, DATABASE_ID, HABBITS_ID } from "@/lib/appwrite";
import { useLocalSearchParams, useRouter } from "expo-router";

const FREQUENCIES = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQUENCIES)[number];

const EditHabitScreen = () => {
  const { id, title: initialTitle, description: initialDescription, frequency: initialFrequency } = useLocalSearchParams();
  const [title, setTitle] = useState<string>(initialTitle as string);
  const [description, setDescription] = useState<string>(initialDescription as string);
  const [frequency, setFrequency] = useState<Frequency>(initialFrequency as Frequency);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await database.updateDocument(DATABASE_ID, HABBITS_ID, id as string, {
        title,
        description,
        frequency,
      });
      router.back();
    } catch (error) {
      console.error("Error updating habit:", error);
      setError("Failed to update habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        mode="outlined"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        label="Description"
        mode="outlined"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
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
      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
      <Button 
        onPress={handleSubmit} 
        mode="contained" 
        loading={loading}
        disabled={loading}
      >
        Update Habit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f4",
  },
  input: {
    marginBottom: 16,
  },
  frequenciesContainer: {
    marginBottom: 24,
  },
});

export default EditHabitScreen;