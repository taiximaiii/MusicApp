import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ScrollView } from "react-native";
import { getAllTrackApi } from "../service/track";
import { Track } from "../interface/Track";
import { getAllArtistApi } from "../service/artist";
import { getAllAlbumApi } from "../service/album";
import { Artist } from "../interface/Artist";
import { Album } from "../interface/Album";

const HomeScreen = ({ navigation }) => {

  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [albums,setAlbums] = useState([]);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      const data = await getAllArtistApi();
      setArtists(data.slice(0, 5));
    };
    const fetchTracks = async () => {
      const data = await getAllTrackApi();
      setTracks(data.slice(7, 10));
    };
    const fetchAlbums = async () => {
      const data = await getAllAlbumApi();
      setAlbums(data);
    };

    fetchArtists();
    fetchTracks();
    fetchAlbums();

    const currentTime = new Date();
    const hours = currentTime.getHours();

    if (hours >= 0 && hours < 12) {
      setGreeting("Good Morning");
    } else if (hours >= 12 && hours < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const handleAllSongsPress = () => {
    navigation.navigate("ListSong");
  };
  const handleAllArtistsPress = () => {
    navigation.navigate("ListArtist");
  };

  const handleArtistPress = (artist: Artist) => {
    navigation.navigate("ArtistDetail", { artist });
  };

  const handleTrackPress = (track: Track) => {
    navigation.navigate("PlayScreen", { track,tracks });
  };
  const handleAlbumPress = (album: Album) => {
    navigation.navigate("AlbumDetail", { album });
  };

  const renderArtist = ({ item }: { item: Artist }) => {
    return (
      <Pressable onPress={() => handleArtistPress(item)}>
        <Image style={styles.imageArtist} source={{ uri: item.imageUrl }} />
        <Text style={styles.artistName}>{item.name}</Text>
      </Pressable>
    );
  };
  const renderTrack = ({ item }: { item: Track }) => {
    return (
      <Pressable onPress={() => handleTrackPress(item)}>
        <Image style={styles.imageArtist} source={{ uri: item.imageUrl }} />
        <Text style={styles.artistName}>{item.title}</Text>
      </Pressable>
    );
  };
  const renderAlbum = ({ item }: { item: Album }) => {
    return (
      <Pressable onPress={() => handleAlbumPress(item)}>
        <Image style={styles.imageArtist} source={{ uri: item.imageUrl }} />
        <Text style={styles.artistName}>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={["#131313", "#121212"]} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.iconstyle}>
          <Text style={styles.name}>{greeting}</Text>
          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={24}
            color="white"
          />
        </View>
        <View style={{ height: 10 }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable style={styles.likedsong} onPress={handleAllArtistsPress}>
            <LinearGradient colors={["#33006F", "#FFFFFF"]}>
              <Pressable style={styles.liked}>
                <MaterialCommunityIcons name="music" size={24} color="white" />
              </Pressable>
            </LinearGradient>

            <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
              All Artists
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable style={styles.likedsong} onPress={handleAllSongsPress}>
            <LinearGradient colors={["#33006F", "#FFFFFF"]}>
              <Pressable style={styles.liked}>
                <MaterialCommunityIcons name="music" size={24} color="white" />
              </Pressable>
            </LinearGradient>

            <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
              All Tracks
            </Text>
          </Pressable>
        </View>

        <View style={styles.Recently}>
          <Text style={styles.namelist}>Top Artist</Text>
        </View>
        <FlatList
          data={artists}
          renderItem={renderArtist}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.Recently}>
          <Text style={styles.namelist}>Top Track</Text>
        </View>
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.Recently}>
          <Text style={styles.namelist}>Top Album</Text>
        </View>
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  name: {
    marginLeft: 10,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  title: {
    marginHorizontal: 12,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  namesong: {
    backgroundColor: "#282828",
    padding: 10,
    borderRadius: 30,
  },
  iconstyle: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  liked: {
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  likedsong: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: "#202020",
    borderRadius: 4,
    elevation: 3,
  },
  namelist: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    margin: 10,
  },
  Recently: {
    margin: 10,
  },
  topArtist: {
    marginVertical: 10,
  },
  imageArtist: {
    width: 100,
    height: 100,
    margin: 20,
  },
  artistName: {
    color: "white",
    textAlign: "center",
    flexWrap: "wrap-reverse",
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
  },
});
