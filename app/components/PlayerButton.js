import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import color from '../misc/color';

const PlayerButton = props => {
  const { iconType, size = 30, iconColor = 'grey', onPress } = props;
  const getIconName = type => {
    switch (type) {
      case 'PLAY':
        return 'pausecircle';
      case 'PAUSE':
        return 'play';
      case 'NEXT':
        return 'stepforward';
      case 'PREV':
        return 'stepbackward';
      case 'FAV':
        return 'heart';
      case 'REPEAT':
        return 'retweet';
    }
  };
  return (
    <AntDesign
      {...props}
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
    />
  );
};

export default PlayerButton;
