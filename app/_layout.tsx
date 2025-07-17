import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useFocusEffect, useRouter, useSegments } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RoutGouard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments();

  useFocusEffect(() => {
    const inAuthGroup = segments[0] === "auth";
    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/");
    }
  });
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
      <SafeAreaProvider>
        <RoutGouard>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="auth"
              options={{
                headerTitleAlign: "center",
                title: "",
              }}
            />
          </Stack>
        </RoutGouard>
      </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
