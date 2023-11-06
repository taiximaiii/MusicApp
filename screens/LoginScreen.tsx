import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

import {
  addTokenToAxios,
  getAccessToken,
  setAccessToken,
} from "../service/token";
import { loginApi } from "../service/user";
import { validateEmail, validatePassword } from "../utils/validation";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const checkLoginStatus = async () => {
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        addTokenToAxios(accessToken);
        navigation.navigate("Main");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");
    const emailValidationResult = validateEmail(email);
    if (emailValidationResult) {
      setEmailError(emailValidationResult);
      return;
    }

    const passwordValidationResult = validatePassword(password);
    if (passwordValidationResult) {
      setPasswordError(passwordValidationResult);
      return;
    }

    const response = await loginApi({ email, password });
    const { data } = response.data;
    const result = setAccessToken(response.data.token);
    if (result) {
      // Alert.alert("Login Success", "You have successfully logged in.");
      navigation.navigate("Main");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/spo.png")} style={styles.logo} />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor="#ffffff"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor="#ffffff"
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.dontHaveAccount}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  spotifyText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    alignItems: 'center', 
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: "#121212",
    color: "#ffffff",
  },
  forgotPassword: {
    paddingLeft: 235,
    color: "#1ED760",
    textDecorationLine: "underline",
    marginBottom: 20,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#1ED760",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  dontHaveAccount: {
    color: "#1ED760",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
