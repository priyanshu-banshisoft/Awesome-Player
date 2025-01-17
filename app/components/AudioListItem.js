import React, { act ,useState,useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';
import MusicInfo from 'expo-music-info-2';

// const getThumbnailText = (uri,filename) => {
//   const [CoverImage, SetCoverImage] = useState("");
//   metadata = MusicInfo.getMusicInfoAsync(uri,
//   {
//     title: true,
//     artist: true,
//     album: true,
//     genre: true,
//     picture: true,
//   }
// )
// SetCoverImage(metadata.picture);
// console.log(metadata.picture == null ? filename[0] : metadata.picture.pictureData);
// };

const convertTime = minutes => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split('.')[0];
    const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};

// const fetchMetadata = (uri,title) => {
//     // let metadata =  MusicInfo.getMusicInfoAsync(uri, {
//     //   title: true,
//     //   artist: true,
//     //   album: true,
//     //   genre: true,
//     //   picture: true,
//     // });
//     // if (metadata != null && metadata.picture !=null) {
//     //   return <Image source={{uri: metadata.picture.pictureData}}/>
//     // } else {
//       return <Text style={styles.thumbnailText}>{title[0]}</Text>
//     //}
// };

const renderPlayPauseIcon = isPlaying => {
  if (isPlaying)
    return (
      <Entypo name='controller-paus' size={24} color={color.ACTIVE_FONT} />
    );
  return <Entypo name='controller-play' size={24} color={color.ACTIVE_FONT} />;
};

const AudioListItem = ({
  uri,
  title,
  duration,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
}) => {
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem
                    ? color.ACTIVE_BG
                    : color.FONT_LIGHT,
                },
              ]}
            >
              {activeListItem ? renderPlayPauseIcon(isPlaying) : <Text style={styles.thumbnailText}>{title[0]}</Text>}
              {/* <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying)
                  : getThumbnailText(uri)}
              </Text> */}
              {/* {activeListItem ? renderPlayPauseIcon(isPlaying) :  <Image source={{uri:coverImage}} />}
              <Image source={{uri:coverImage}} /> */}
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo
            onPress={onOptionPress}
            name='dots-three-vertical'
            size={20}
            color={color.FONT_MEDIUM}
            style={{ padding: 10 }}
          />
        </View>
      </View>
      <View style={styles.separator} />
    </>
  );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: width - 60,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: color.FONT_MEDIUM,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: color.FONT,
  },
  separator: {
    width: width - 80,
    backgroundColor: '#333',
    opacity: 0.3,
    height: 0.5,
    alignSelf: 'center',
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },
});

export default AudioListItem;
