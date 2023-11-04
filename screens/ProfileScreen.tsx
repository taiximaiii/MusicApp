import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { removeAccessToken } from "../service/token";
import { UserProfile } from "../interface/UserProfile";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { profileApi } from "../service/user";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await profileApi();

      setUser(data);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await removeAccessToken();
    // Alert.alert("Logout Success", "You have successfully logged out.");
    navigation.navigate("Login");
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profileImageSource = user.imageUrl
    ? { uri: user.imageUrl }
    : require("../assets/image1.png");

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <Image source={profileImageSource} style={styles.profileImage} />
        <Text style={styles.username}>{user.name}</Text>
      </View>
      <View style={styles.userInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Ngày sinh:</Text>
          <Text style={styles.infoText}>{user.birthDay}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {

    alignItems: "center",
    marginTop: 100,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  userInfo: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft:10
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: "white",
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 40,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    fontSize: 18,
    color: "white",
  },
  
});

export default ProfileScreen;
