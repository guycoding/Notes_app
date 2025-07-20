import { useAuth } from "@/lib/auth-context";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, Surface, ActivityIndicator } from "react-native-paper";
import {
  database,
  DATABASE_ID,
  HABBITS_ID,
  client,
} from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { useEffect, useState } from "react";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const StreaksScreen = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await database.listDocuments(DATABASE_ID, HABBITS_ID, [
          Query.equal("user_id", user.$id),
          Query.orderDesc("streak_count"),
          Query.limit(10), // Limit to 10 habits for better chart visibility
        ]);
        setHabits(response.documents as Habit[]);
      } catch (err) {
        console.error("Error fetching habits:", err);
        setError("Failed to load streaks data");
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();

    // Set up real-time subscription
    const channel = `databases.${DATABASE_ID}.collections.${HABBITS_ID}.documents`;
    const unsubscribe = client.subscribe(channel, (response) => {
      if (response.events.includes("databases.*.collections.*.documents.*.update")) {
        fetchHabits(); // Refresh when habits are updated
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Prepare data for the chart
  const chartData = {
    labels: habits.map((habit) => habit.title.substring(0, 10)), // Limit title length
    datasets: [
      {
        data: habits.map((habit) => habit.streak_count || 0), // Ensure we have a number
        colors: habits.map((_, index) => 
          (opacity = 1) => `rgba(98, 0, 238, ${opacity})` // Purple color for all bars
        ),
      },
    ],
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="chart-line" size={48} color="#6200ee" />
        <Text style={styles.emptyText}>No habits found</Text>
        <Text style={styles.emptySubtext}>Complete habits to build streaks</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        Your Streaks
      </Text>

      <Surface style={styles.chartSurface}>
        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" days"
          yAxisInterval={1}
          fromZero
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForLabels: {
              fontSize: 10,
            },
            barPercentage: 0.5,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </Surface>

      <View style={styles.streaksList}>
        {habits.map((habit) => (
          <Surface key={habit.$id} style={styles.habitCard} elevation={1}>
            <View style={styles.habitInfo}>
              <Text style={styles.habitTitle}>{habit.title}</Text>
              <Text style={styles.habitFrequency}>
                {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
              </Text>
            </View>
            <View style={styles.streakContainer}>
              <MaterialCommunityIcons name="fire" size={20} color="#ff9800" />
              <Text style={styles.streakText}>
                {habit.streak_count || 0} day streak
              </Text>
            </View>
          </Surface>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 16,
    color: "#6200ee",
  },
  chartSurface: {
    borderRadius: 16,
    padding: 8,
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },
  streaksList: {
    flex: 1,
  },
  habitCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  habitFrequency: {
    fontSize: 12,
    color: "#666666",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#6200ee",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
  },
});

export default StreaksScreen;