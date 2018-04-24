import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {colors} from "../../lib/colors"

const LetterCircle = ({size, letter, textColor=colors.blue, color='#EFEFFD'}) => (
  <View style={{
    height: size,
    width: size,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: color,
    borderRadius: size/2,
  }}>
    <Text style={{
      textAlign: 'center',
      color: textColor,
      fontSize: 17,
      fontWeight: '600',
      backgroundColor: 'rgba(0,0,0,0)'
    }}>{letter}</Text>
  </View>
);

export default LetterCircle;
