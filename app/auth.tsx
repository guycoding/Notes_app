import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import React, { use, useState } from "react";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";


const auth = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter()
  const  {signIn,signUp}= useAuth();
  const handleswithchMode = () => {
    setIsSignUp((prev) => !prev);
  };
  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    } 
    if (password.length < 6) {
      setError("Password length must be at least 6 characters long");
      return;
    }
    setError(null)
    if(isSignUp) {
      const error = await signUp(email,password)
      if(error){
        setError(error)
        return
      }
    }else{
      const error = await signIn(email,password)
        if(error){
        setError(error)
        return
        }
        router.replace('/');
      
    }
  }; 
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "create an account" : "Welcome back"}
        </Text>
        <TextInput
          style={styles.input}
          label="Email"
          autoCapitalize="none"
          placeholder="exmple@gmail.com "
          keyboardType="email-address"
          mode="outlined"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          label="Password"
          autoCapitalize="none"
          placeholder="exmple@gmail.com "
          secureTextEntry={true}
          autoCorrect={false}
          mode="outlined"
          onChangeText={setPassword}
        />
        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
        <Button onPress={handleAuth} style={styles.buttton} mode="contained">
          {isSignUp ? "Sign up" : "Sign in"}
        </Button>
        <Button
          style={styles.switchModeButton}
          onPress={handleswithchMode}
          mode="text"
        >
          {isSignUp
            ? "Already Have an account? Sign in"
            : "Don't have an account? Sign up"}
          ?{" "}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default auth;

const styles = StyleSheet.create({
  buttton: {
    marginTop: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
