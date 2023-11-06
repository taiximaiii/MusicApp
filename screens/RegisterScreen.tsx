import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { registerApi } from "../service/user";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation";


const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [birthday, setbirthday] = useState(""); 


  const handleRegister = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const nameValidationResult = validateName(name);
    if (nameValidationResult) {
      setNameError(nameValidationResult);
      return;
    }
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

    if (password !== confirmPassword) {
      setConfirmPasswordError("Password and confirm password do not match.");
      return;
    }

   
    registerApi({
      name,
      email,
      password,
      birthday
    })
      .then((response) => {
        Alert.alert(
          "Registration Success",
          "You have successfully registered."
        );
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Registration error:", error);

        Alert.alert(
          "Registration Failed",
          "An error occurred during registration. Please try again."
        );
      });
  };



  return (
    <View style={styles.container}>
      <Image source={require("../assets/spo.png")} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        placeholderTextColor="#ffffff"
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor="#ffffff"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor="#ffffff"
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
        placeholderTextColor="#ffffff"
      />
      {confirmPasswordError ? (
        <Text style={styles.errorText}>{confirmPasswordError}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (dd/mm/yyyy)"
        value={birthday}
        onChangeText={(text) => setbirthday(text)}
        placeholderTextColor="#ffffff"
      />

      
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.haveAccount}>Already have an account? Login</Text>
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
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 30,
    fontStyle: "italic",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: "#121212",
    color: "#ffffff",
  },
  registerButton: {
    backgroundColor: "#1ED760",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  haveAccount: {
    color: "#1ED760",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  }
});

export default RegisterScreen;
