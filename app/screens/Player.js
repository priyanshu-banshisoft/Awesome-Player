import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import Screen from '../components/Screen';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import {
  changeAudio,
  moveAudio,
  pause,
  play,
  playNext,
  resume,
} from '../misc/audioController';
import { convertTime, storeAudioForNextOpening } from '../misc/helper';
import { selectAudio } from '../misc/audioController';
import MusicInfo from 'expo-music-info-2';

const { width } = Dimensions.get('window');

const Player = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio } = context;
  const [coverImage, setCoverImage] = useState("");
  const [artist, setArtist] = useState("");

    const fetchMetadata = async () => {
      try {
        const metadata = await MusicInfo.getMusicInfoAsync(currentAudio.uri, {
          title: true,
          artist: true,
          album: true,
          genre: true,
          picture: true,
        });
        if (metadata && metadata.picture) {
          setCoverImage(metadata.picture.pictureData);
        } else {
          setCoverImage('');
          console.log('Metadata is null or does not contain a picture for URI:', uri);
        }
        if (metadata && metadata.artist) {
          setArtist(metadata.artist);
        } else {
          setArtist('');
          console.log('Metadata is null or does not contain a picture for URI:', uri);
        }
      } catch (error) {
        setArtist('');
        setCoverImage('');
        console.log('Error fetching metadata:', error);
      }
    };


  const calculateSeebBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }
    return 0;
  };

useEffect(() => {
  const interval = setInterval(() => {
    if (context.isPlaying && context.soundObj) {
      context.playbackObj.getStatusAsync().then(status => {
        if (status.isPlaying) {
          context.updateState(context, {
            playbackPosition: status.positionMillis,
            playbackDuration: status.durationMillis,
          });
        }
      });
    }
  }, 1000);

  return () => clearInterval(interval);
}, [context.isPlaying, context.soundObj]);

  useEffect(() => {
    fetchMetadata();
  },[fetchMetadata]);

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
  };

  const handleNext = async () => {
    await changeAudio(context, 'next');
  };

  const handlePrevious = async () => {
    await changeAudio(context, 'previous');
  };

  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

  if (!context.currentAudio) return null;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: 'row' }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: 'bold' }}>From Playlist: </Text>
                <Text>{context.activePlayList.title}</Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>{`${
            context.currentAudioIndex + 1
          } / ${context.totalAudioCount}`}</Text>
        </View>
        <View style={styles.midBannerContainer}>
         {coverImage ? <Image source={{uri:coverImage}} style={{width:300,height:300}} /> : <FontAwesome5 name='compact-disc' size={300} color={'white'}  /> }
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>
          <Text numberOfLines={1} style={styles.artistTitle}>
            {artist ? artist : 'No Artist'}
            </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
            }}
          >
            <Text style={{color:'grey'}}>{renderCurrentTime()}</Text>
            <Text style={{color:'grey'}}>
              {convertTime(context.currentAudio.duration)}
            </Text>
          </View>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
            onValueChange={value => {
              setCurrentPosition(
                convertTime(value * context.currentAudio.duration)
              );
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying) return;

              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log('error inside onSlidingStart callback', error);
              }
            }}
            onSlidingComplete={async value => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllers}>
          <PlayerButton iconType='REPEAT'  />
            <PlayerButton iconType='PREV' onPress={handlePrevious} />
            <PlayerButton
              onPress={handlePlayPause}
              size={50}
              iconType={context.isPlaying ? 'PLAY' : 'PAUSE'}
            />
            <PlayerButton iconType='NEXT' onPress={handleNext} />
            <PlayerButton iconType='FAV'  />
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  audioControllers: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 20,
  },
  audioCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    paddingBottom: 25,
  },
  audioCount: {
    textAlign: 'right',
    color: color.FONT_LIGHT,
    fontSize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
  },
  artistTitle: {
    fontSize: 12,
    color: color.FONT,
    paddingStart: 15,
    paddingBottom: 15,
  },
});

export default Player;
