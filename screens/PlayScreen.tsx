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
import { setupPlayer } from '../trackPlayerServices';
import { Comment } from '../interface/Comment';
import { addCommentApi, getCommentInTrack } from '../service/comment';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TextInput } from 'react-native-gesture-handler';


const { width } = Dimensions.get('window');

function PlayScreen({ route,navigation }) {
  const { tracks, track } = route.params;

  const [currentTrack, setCurrentTrack] = useState(track);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const fetchData = async () => {
    const data = await getCommentInTrack(track.id);
    setComments(data);
  };

  
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
    fetchData();
  }, []);

  if (!isPlayerReady) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const addComment = async () => {
    if (!commentText) {
      return;
    }
    await addCommentApi(commentText, track.id);
    setCommentText("");
    fetchData();
  };
  const formatTimestamp = (timestamp: string) => {
    try {
      const commentDate = new Date(timestamp);
      const distance = formatDistanceToNow(commentDate, {
        addSuffix: true,
        includeSeconds: true,
        locale: vi,
      });
      return distance;
    } catch (error) {
      return "Invalid Timestamp";
    }
  };

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
      <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Comments</Text>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.commentUsername}>{item.user.name}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
                <Text style={styles.commentTimestamp}>
                  {formatTimestamp(item.timestamp)}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#888"
            value={commentText}
            onChangeText={(text) => setCommentText(text)}
          />
          <TouchableOpacity style={styles.commentButton} onPress={addComment}>
            <Text style={styles.commentButtonText}>Add Comment</Text>
          </TouchableOpacity>
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
  },
  commentsContainer: {
    flex: 1,
    width: "80%",
    marginTop: 20,
    marginLeft:40
    
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  comment: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 5,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1ED760",
  },
  commentText: {
    fontSize: 14,
    color: "white",
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  commentInput: {
    backgroundColor: "#333",
    borderRadius: 5,
    color: "white",
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  commentButton: {
    backgroundColor: "#1ED760",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  commentButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PlayScreen;
