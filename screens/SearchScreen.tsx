import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Artist } from '../interface/Artist';
import { Album } from '../interface/Album';
import { Track } from '../interface/Track';
import { getAllArtistApi } from '../service/artist';
import { getAllAlbumApi} from '../service/album';
import { getAllTrackApi } from '../service/track';

const SearchScreen = ({ navigation }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [input, setInput] = useState('');
  const [searchedArtists, setSearchedArtists] = useState<Artist[]>([]);
  const [searchedAlbums, setSearchedAlbums] = useState<Album[]>([]);
  const [searchedTracks, setSearchedTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState<'artist' | 'album' | 'track'>('artist');

  const fetchData = async () => {
    setIsLoading(true);

    if (searchType === 'artist') {
      const data = await getAllArtistApi();
      setArtists(data);
    } else if (searchType === 'album') {
      const data = await getAllAlbumApi();
      setAlbums(data);
    } else if (searchType === 'track') {
      const data = await getAllTrackApi();
      setTracks(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchType]);

  const handleInputChange = (text: string) => {
    setInput(text);
    handleSearch(text);
  };

  const handleSearch = (text: string) => {
    if (searchType === 'artist') {
      const filteredArtists = artists.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
      setSearchedArtists(filteredArtists);
    } else if (searchType === 'album') {
      const filteredAlbums = albums.filter((item) => item.title.toLowerCase().includes(text.toLowerCase()));
      setSearchedAlbums(filteredAlbums);
    } else if (searchType === 'track') {
      const filteredTracks = tracks.filter((item) => item.title.toLowerCase().includes(text.toLowerCase()));
      setSearchedTracks(filteredTracks);
    }
  };

  const handleItemPress = (item: Artist | Album | Track) => {
 
    if (searchType === 'artist') {
      navigation.navigate('ArtistDetail', { artist: item });
    } else if (searchType === 'album') {
      navigation.navigate('AlbumDetail', { album: item });
    } else if (searchType === 'track') {
      navigation.navigate('PlayScreen', { track: item,tracks });
    }
  };

  const renderArtist = ({ item }: { item: Artist }) => {
    return (
      <Pressable style={styles.itemContainer} onPress={() => handleItemPress(item)}>
        <Image style={styles.itemImage} source={{ uri: item.imageUrl }} />
        <View style={styles.itemInfo}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </Pressable>
    );
  };

  const renderAlbum = ({ item }: { item: Album }) => {
    return (
      <Pressable style={styles.itemContainer} onPress={() => handleItemPress(item)}>
        <Image style={styles.itemImage} source={{ uri: item.imageUrl }} />
        <View style={styles.itemInfo}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.itemInfoText}>{item.releaseDate}</Text>
        </View>
      </Pressable>
    );
  };

  const renderTrack = ({ item }: { item: Track }) => {
    return (
      <Pressable style={styles.itemContainer} onPress={() => handleItemPress(item)}>
        <Image style={styles.itemImage} source={{ uri: item.imageUrl }} />
        <View style={styles.itemInfo}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.itemInfoText}>{item.artist}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={['#131313', '#121212']} style={styles.container}>
      <View style={styles.header}>
       
        <View style={styles.searchBar}>
          <Pressable style={styles.searchIconContainer}>
            <AntDesign name="search1" size={20} color="white" />
            <TextInput
              value={input}
              onChangeText={(text) => handleInputChange(text)}
              placeholder={`Find ${searchType}s`}
              placeholderTextColor={'white'}
              style={{ fontWeight: '500', color: 'white' }}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.typeSwitchContainer}>
        <TouchableOpacity
          style={[
            styles.typeSwitchButton,
            searchType === 'artist' && styles.activeTypeButton,
          ]}
          onPress={() => setSearchType('artist')}
        >
          <Text style={styles.typeSwitchText}>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeSwitchButton,
            searchType === 'album' && styles.activeTypeButton,
          ]}
          onPress={() => setSearchType('album')}
        >
          <Text style={styles.typeSwitchText}>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeSwitchButton,
            searchType === 'track' && styles.activeTypeButton,
          ]}
          onPress={() => setSearchType('track')}
        >
          <Text style={styles.typeSwitchText}>Tracks</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{`All ${searchType}s`}</Text>
      </View>


      <View style={styles.itemListContainer}>
        {searchType === 'artist' && (
          <FlatList
            data={searchedArtists.length > 0 ? searchedArtists : artists}
            renderItem={renderArtist}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="gray" /> : null}
          />
        )}
        {searchType === 'album' && (
          <FlatList
            data={searchedAlbums.length > 0 ? searchedAlbums : albums}
            renderItem={renderAlbum}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="gray" /> : null}
          />
        )}
        {searchType === 'track' && (
          <FlatList
            data={searchedTracks.length > 0 ? searchedTracks : tracks}
            renderItem={renderTrack}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="gray" /> : null}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 30,
    padding: 10,
    marginBottom:20
  },
  searchBar: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },
  searchIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#333',
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
    fontWeight: 'bold',
    color: 'white',
  },
  typeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  typeSwitchButton: {
    padding: 10,
    borderRadius: 5,
  },
  activeTypeButton: {
    backgroundColor: '#444', // Change to your active background color
  },
  typeSwitchText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemListContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  itemInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  itemInfoText: {
    marginTop: 5,
    color: '#D3D3D3',
  },
  customBackButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default SearchScreen;
