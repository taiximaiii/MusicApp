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
  Modal,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Track } from '../interface/Track';
import { deleteTrackApi, getAllTrackApi, uploadTrackApi } from '../service/track';
import DocumentPicker from 'react-native-document-picker';
import { Swipeable } from 'react-native-gesture-handler';

const ListSongScreen = ({ navigation }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newTrack, setNewTrack] = useState({
    title: '',
    artist: '',
    genre: '',
    imageFile: {
      uri: '',
      name: '',
      type: '',
    },
    mp3File: {
      uri: '',
      name: '',
      type: '',
    },
  });
  const [isUploading, setIsUploading] = useState(false);

  const [isSortingAscending, setIsSortingAscending] = useState(true);

  const toggleSortingOrder = () => {
    const sortedData = [...tracks].sort((a, b) =>
      isSortingAscending ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
    );
    setTracks(sortedData);
    setIsSortingAscending(!isSortingAscending);
  };

  const fetchData = async () => {
    const data = await getAllTrackApi();
    setTracks(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTrackPress = (track: Track) => {
    navigation.navigate('PlayScreen', { track, tracks });
  };

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const uri = result[0].uri;
      const name = result[0].name;
      const type = result[0].type;
      setNewTrack({ ...newTrack, imageFile: { uri, name, type } });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        throw error;
      }
    }
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      const uri = result[0].uri;
      const name = result[0].name;
      const type = result[0].type;
      setNewTrack({ ...newTrack, mp3File: { uri, name, type } });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        throw error;
      }
    }
  };

  const handleNewTrack = async () => {
    if (!newTrack.title || !newTrack.artist || !newTrack.imageFile || !newTrack.mp3File) {
      console.log('Please fill in all required information.');
      return;
    }

    setIsUploading(true);

    try {
      await uploadTrackApi(newTrack);
      setModalVisible(false);
      setNewTrack({
        title: '',
        artist: '',
        genre: '',
        imageFile: { uri: '', name: '', type: '' },
        mp3File: { uri: '', name: '', type: '' },
      });
      fetchData();
    } catch (error) {
      console.error('Error creating a new track:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // const handleSwipeLeft = async (track: Track) => {
  //   deleteTrackApi(track.id);
  //   fetchData();
  // };

  const renderTrack = ({ item }: { item: Track }) => {
  
    return (
        <TouchableOpacity
          style={styles.trackContainer}
          onPress={() => handleTrackPress(item)}
        >
          <Image style={styles.trackImage} source={{ uri: item.imageUrl }} />
          <View style={styles.trackInfo}>
            <Text style={styles.trackName}>{item.title}</Text>
            <Text style={styles.artistName}>{item.artist}</Text>
          </View>
          <TouchableOpacity style={styles.iconContainer}>
            <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
          </TouchableOpacity>
        </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#131313', '#121212']} style={styles.container}>
      <TouchableOpacity
        style={styles.customBackButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>All Tracks</Text>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.sortButton} onPress={toggleSortingOrder}>
          <AntDesign
            name={isSortingAscending ? 'arrowdown' : 'arrowup'}
            size={20}
            color="white"
          />
        </Pressable>
        <View style={styles.playControls}>
          <Pressable
            style={styles.playButton}
            onPress={() => setModalVisible(true)}
          >
            <Entypo name="plus" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      <View style={styles.trackListContainer}>
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={
            isLoading ? <ActivityIndicator size="large" color="gray" /> : null
          }
        />
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload New Track</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Title"
              value={newTrack.title}
              onChangeText={(text) => setNewTrack({ ...newTrack, title: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Artist"
              value={newTrack.artist}
              onChangeText={(text) => setNewTrack({ ...newTrack, artist: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Genre"
              value={newTrack.genre}
              onChangeText={(text) => setNewTrack({ ...newTrack, genre: text })}
            />
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
            {newTrack.imageFile && (
              <Text style={styles.uploadedFile}>
                Image: {newTrack.imageFile.name}
              </Text>
            )}
            <TouchableOpacity style={styles.uploadButton} onPress={pickAudio}>
              <Text style={styles.uploadButtonText}>Upload Audio</Text>
            </TouchableOpacity>
            {newTrack.mp3File && (
              <Text style={styles.uploadedFile}>
                Audio: {newTrack.mp3File.name}
              </Text>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleNewTrack}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.modalButtonText}>Create</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customBackButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 20,
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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1DB954',
  },
  trackListContainer: {
    flex: 1,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  artistName: {
    marginTop: 5,
    color: '#D3D3D3',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1ED760',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadedFile: {
    color: 'white',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#121212',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  uploadButtonText: {
    color: 'black',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default ListSongScreen;
