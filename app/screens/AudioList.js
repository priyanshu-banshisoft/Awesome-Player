import React, { Component ,useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, TextInput } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import { Ionicons } from "@expo/vector-icons";
import {
  play,
  pause,
  resume,
  playNext,
  selectAudio,
} from '../misc/audioController';
import { storeAudioForNextOpening } from '../misc/helper';

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };

    this.currentItem = {};
  }
  
  layoutProvider = new LayoutProvider(
    i => 'audio',
    (type, dim) => {
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  handleAudioPress = async audio => {
    await selectAudio(audio, this.context);
    this.props.navigation.navigate('Player');
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        uri={item.uri}
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item) }
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate('PlayList');
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                options={[
                  {
                    title: 'Add to playlist',
                    onPress: this.navigateToPlaylist,
                  },
                ]}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                visible={this.state.optionModalVisible}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchbox: {
    flexDirection: "row",
    width: "90%",
    height: 54,
    borderRadius: 50,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingEnd: 60,
    alignSelf: "flex-start",
    backgroundColor: "grey",
  },
});

export default AudioList;
