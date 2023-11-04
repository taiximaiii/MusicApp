import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient"; 
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Artist } from "../interface/Artist";
import { getAllArtistApi } from "../service/artist";



const ListArtistScreen = ({ navigation }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [input, setInput] = useState("");
  const [searchedArtists, setSearchedArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const data = await getAllArtistApi();
    setArtists(data)
    setIsLoading(false)
  };
  useEffect(() => {
    fetchData(); 

  }, []);

  const handleInputChange = (text: string) => {
    setInput(text);
    handleSearch(text);

    const filteredArtists = artists.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchedArtists(filteredArtists);
  };

  const handleSearch = (text: string) => {
    const filteredArtists = artists.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchedArtists(filteredArtists);
  };

  const handleArtistPress = (artist: Artist) => {
    // Xử lý khi người dùng chọn một nghệ sĩ
    navigation.navigate("ArtistDetail", { artist });
  };

  const renderArtist = ({ item }: { item: Artist }) => {
    return (
      <Pressable
        style={styles.artistContainer}
        onPress={() => handleArtistPress(item)}
      >
        <Image style={styles.artistImage} source={{ uri: item.imageUrl }} />
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{item.name}</Text>
          <Text style={styles.artistInfoText}>{item.info}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={["#131313", "#121212"]} style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity
        style={styles.customBackButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
        <View style={styles.searchBar}>
          <Pressable style={styles.searchIconContainer}>
            <AntDesign name="search1" size={20} color="white" />
            <TextInput
              value={input}
              onChangeText={(text) => handleInputChange(text)}
              placeholder="Find Artists"
              placeholderTextColor={"white"}
              style={{ fontWeight: "500", color: "white" }}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>All Artists</Text>
      </View>

      <View style={styles.artistListContainer}>
        <FlatList
          data={searchedArtists.length > 0 ? searchedArtists : artists}
          renderItem={renderArtist}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={
            isLoading ? <ActivityIndicator size="large" color="gray" /> : null
          }
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 10,
    padding: 10,
  },
  searchBar: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
  },
  searchIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#333",
    padding: 7,
    flex: 1,
    borderRadius: 30,
    height: 50,
  },
  titleContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  artistListContainer: {
    flex: 1,
  },
  artistContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  artistInfoText: {
    marginTop: 5,
    color: "#D3D3D3",
  },
  customBackButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default ListArtistScreen;
