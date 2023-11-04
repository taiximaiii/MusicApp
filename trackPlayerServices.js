import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
} from 'react-native-track-player';
import { getAllTrackApi } from './service/track';

export async function setupPlayer(){
  let isSetup = false;
  try {
      await TrackPlayer.getCurrentTrack()
      isSetup = true
  } catch (error) {
      await TrackPlayer.setupPlayer()
      isSetup = true
  } finally{
      return isSetup;
  }
}

export async function addTracksFromApi() {
  try {
    const tracks = await getAllTrackApi(); 
    const tracksToAdd = tracks.map((track, index) => ({
      id: index.toString(),
      url: track.mp3Url,
      title: track.title,
      artist: track.artist,
    }));

    await TrackPlayer.add(tracksToAdd);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  } catch (error) {
    console.error('Error adding tracks from API:', error);
  }
}



export async function playbackService (){
  TrackPlayer.addEventListener(Event.RemotePause, () => {
      TrackPlayer.pause()
  })

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
      TrackPlayer.play()
  })
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
      TrackPlayer.skipToNext()
  })
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      TrackPlayer.skipToPrevious()
  })
  
}
