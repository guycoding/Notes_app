import { useAuth } from "@/lib/auth-context";
import { View, StyleSheet, Alert, Animated } from "react-native";
import { Button, Surface, Text, Menu, Divider, Portal } from "react-native-paper";
import {
  database,
  DATABASE_ID,
  HABBITS_ID,
  client,
  RealtimeResponse,
} from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { useEffect, useState, useRef } from "react";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signOut, user } = useAuth();
  const router = useRouter();
  const swipeableRefs = useRef<{[key: string]: Swipeable | null}>({});

  useEffect(() => {
    fetchHabits();
    const channel = `databases.${DATABASE_ID}.collections.${HABBITS_ID}.documents`;
    const habbitsSubscribe = client.subscribe(
      channel,
      (response: RealtimeResponse) => {
        if (
          response.events.includes(
            "databases.*.collection.*.documents.*.create"
          ) ||
          response.events.includes(
            "databases.*.collection.*.documents.*.update"
          ) ||
          response.events.includes("databases.*.collection.*.documents.*.delete")
        ) {
          fetchHabits();
        }
      }
    );
    return () => habbitsSubscribe();
  }, [user]);

  const fetchHabits = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await database.listDocuments(DATABASE_ID, HABBITS_ID, [
        Query.equal("user_id", user?.$id ?? ""),
      ]);
      setHabits(response.documents as Habit[]);
    } catch (err) {
      console.error("Error fetching habits:", err);
      setError("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (habitId: string) => {
    try {
      await database.deleteDocument(DATABASE_ID, HABBITS_ID, habitId);
      // Close the swipeable if it's open
      if (swipeableRefs.current[habitId]) {
        swipeableRefs.current[habitId]?.close();
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      Alert.alert("Error", "Failed to delete habit");
    }
  };

  const confirmDelete = (habitId: string) => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Delete", onPress: () => handleDelete(habitId) },
      ]
    );
  };

  const handleEdit = (habit: Habit) => {
    router.push({
      pathname: "/edit-habit",
      params: { 
        id: habit.$id,
        title: habit.title,
        description: habit.description || '',
        frequency: habit.frequency
      }
    });
  };

  const renderRightActions = (progress: any, dragX: any, habitId: string) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.editAction, styles.actionButton]}
          onPress={() => {
            const habit = habits.find(h => h.$id === habitId);
            if (habit) {
              handleEdit(habit);
              swipeableRefs.current[habitId]?.close();
            }
          }}
        >
          <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
            Edit
          </Animated.Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteAction, styles.actionButton]}
          onPress={() => confirmDelete(habitId)}
        >
          <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
            Delete
          </Animated.Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleComplete = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.$id === habitId);
      if (!habit) return;
      
      const today = new Date().toISOString().split('T')[0];
      const lastCompleted = habit.last_completed ? new Date(habit.last_completed).toISOString().split('T')[0] : null;
      
      let newStreak = habit.streak_count;
      if (lastCompleted !== today) {
        // If the habit wasn't completed today
        if (lastCompleted && isYesterday(new Date(lastCompleted))) {
          // If it was completed yesterday, increment streak
          newStreak += 1;
        } else {
          // Otherwise reset streak to 1
          newStreak = 1;
        }
      }

      await database.updateDocument(DATABASE_ID, HABBITS_ID, habitId, {
        streak_count: newStreak,
        last_completed: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error completing habit:", error);
      Alert.alert("Error", "Failed to update habit");
    }
  };

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} variant="headlineSmall">
          Today's Habits
        </Text>
        <Button mode="text" onPress={signOut} icon="logout">
          Sign Out
        </Button>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No habits yet. Add your first habit
          </Text>
        </View>
      ) : (
        habits.map((habit) => (
          <Swipeable
            key={habit.$id}
            ref={(ref) => (swipeableRefs.current[habit.$id] = ref)}
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, habit.$id)
            }
            rightThreshold={40}
            friction={2}
          >
            <Surface style={styles.card} elevation={0}>
              <View style={styles.cardContent}>
                <View style={styles.habitMain}>
                  <Text style={styles.cardTitle}>{habit.title}</Text>
                  <Text style={styles.cardDescription}>{habit.description}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.streakBadge}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={18}
                      color="#ff9800"
                    />
                    <Text style={styles.streakText}>
                      {habit.streak_count} day streak
                    </Text>
                  </View>
                  <View style={styles.frequencyBadge}>
                    <Text style={styles.frequencyText}>
                      {habit.frequency.charAt(0).toUpperCase() +
                        habit.frequency.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={() => handleComplete(habit.$id)}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#4CAF50"
                />
              </TouchableOpacity>
            </Surface>
          </Swipeable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    color: "#060606",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  habitMain: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 14,
    color: "#6c6c80",
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#666666",
    fontSize: 16,
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
    marginTop: 16,
  },
  swipeActions: {
    flexDirection: 'row',
    width: 160,
    marginBottom: 16,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  editAction: {
    backgroundColor: '#2196F3',
  },
  deleteAction: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
  },
  completeButton: {
    marginLeft: 12,
    padding: 8,
  },
});