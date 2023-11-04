import React, { useState, useEffect } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View,TouchableOpacity,ScrollView } from 'react-native';
import TrackPlayer, {
  Event,
  Track,
  useTrackPlayerEvents,
  usePlaybackState,
  RepeatMode,
} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SongInfo from '../components/SongInfo';
import SongSlider from '../components/SongSlider';
import ControlCenter from '../components/ControlCenter';
import { addTracksFromApi, setupPlayer } from '../trackPlayerServices';

const { width } = Dimensions.get('window');

function PlayScreen({ route,navigation }) {
  const { tracks, track } = route.params;

  const [currentTrack, setCurrentTrack] = useState(track);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged) {
      const playingTrack = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(playingTrack);
    }
  });
  async function setup() {
    let isSetup = await setupPlayer();
    setIsPlayerReady(isSetup);
    
    if (isSetup) {
      await TrackPlayer.reset();
      const tracksToAdd = tracks.map((track:Track, index:number) => ({
        id: index.toString(),
        url: track.mp3Url,
        title: track.title,
        artist: track.artist,
        artwork: track.imageUrl,
      }));
      const currentTrackIndex = tracks.findIndex((track:Track) => track.id == currentTrack.id);
      await TrackPlayer.skip(currentTrackIndex)
      await TrackPlayer.add(tracksToAdd);
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    }
  }

  useEffect(() => {
    setup();
  }, []);

  if (!isPlayerReady) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderArtWork = () => {
    return (
      <View style={styles.listArtWrapper}>
        <View style={styles.albumContainer}>
          {currentTrack && currentTrack.artwork && (
            <Image style={styles.albumArtImg} source={{ uri: currentTrack.artwork }} />
          )}
        </View>
      </View>
    );
  };
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.customBackButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
      <FlatList
        horizontal
        data={tracks}
        renderItem={renderArtWork}
        keyExtractor={(item) => item.id.toString()}
      />
      <SongInfo track={currentTrack} />
      <SongSlider />
      <ControlCenter />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
   
    backgroundColor: '#001d23',
  },
  listArtWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumContainer: {
    width: 300,
    height: 300,
  },
  albumArtImg: {
    height: '100%',
    borderRadius: 4,
  },
  customBackButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 20,
  },
  contentContainer:{
    marginTop:70,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default PlayScreen;
