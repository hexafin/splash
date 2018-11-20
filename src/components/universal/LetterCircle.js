import React from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import {colors} from "../../lib/colors"
import {icons} from "../../lib/styles"

const LetterCircle = ({size, letter, textColor=colors.blue, color='#EFEFFD', currency=null}) => (
  <View style={{
    height: size,
    width: size,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: color,
    borderRadius: size/2,
  }}>
    {!currency && <Text style={{
          textAlign: 'center',
          color: textColor,
          fontSize: 17,
          fontWeight: '600',
          backgroundColor: 'rgba(0,0,0,0)'
        }}>{letter}</Text>}
    {currency == 'BTC' && <Image source={icons.btcLetter} style={{width: 12, height: 15.75, alignSelf: 'center'}} resizeMode={'contain'}/>}
    {currency == 'ETH' && <Image source={icons.ethLetter} style={{width: 12, height: 15.75, alignSelf: 'center'}} resizeMode={'contain'}/>}
    {currency == 'GUSD' && <Image source={icons.gusdLetter} style={{width: 12, height: 15.75, alignSelf: 'center'}} resizeMode={'contain'}/>}
  </View>
);

export default LetterCircle;
