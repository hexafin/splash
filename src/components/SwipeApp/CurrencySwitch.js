// @flow
import React, {Component} from 'react'
import {
  Platform, 
  StyleSheet, 
  TouchableWithoutFeedback,
  Text,
  Share,
  TextInput,
  Image,
  View,
  ScrollView,
  Keyboard,
  Animated,
  Dimensions
} from 'react-native'
import { isIphoneX } from "react-native-iphone-x-helper"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { connect } from "react-redux"
import { cryptoNames, cryptoNameDict, cryptoColors, cryptoImages } from "../../lib/cryptos"
import { bindActionCreators } from "redux"
import { colors } from "../../lib/colors"
import Interactable from 'react-native-interactable';
const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

let currencies = []
let i = 0
let snapPoints = []
cryptoNames.forEach(crypto => {
  currencies.push({
    index: i,
    name: cryptoNameDict[crypto],
    code: crypto,
    image: cryptoImages[crypto]
  })
  snapPoints.push({
    x: -1 * (SCREEN_WIDTH/2-45) * i
  })
  i++
})

class CurrencySwitch extends Component {

  constructor(props) {
    super(props)
  }

  handleCurrencySwitch(currency) {
    console.log(currency)
  }

  render() {

    return (
      <Animated.View style={{
        ...styles.container,
        opacity: Animated.multiply(
          this.props.xOffset.interpolate({
            inputRange: [SCREEN_WIDTH*2/3, SCREEN_WIDTH, SCREEN_WIDTH*4/3],
            outputRange: [0, 1, 0]
          }),
          this.props.yOffsets.home.interpolate({
            inputRange: [0, 140, 160],
            outputRange: [1, 1, 0]
          })
        ),
        transform: [
          {translateY: Animated.add(
            this.props.yOffsets.home.interpolate({
              inputRange: [-81, -80, 0, 160, 161],
              outputRange: [50, 50, 0, -100, -300]
            }),
            this.props.xOffset.interpolate({
              inputRange: [0, SCREEN_WIDTH*2/3, SCREEN_WIDTH, SCREEN_WIDTH*4/3, SCREEN_WIDTH*2],
              outputRange: [-300, -50, 0, -50, -300]
            })
          )},
        ]
      }} pointerEvents="box-none">

        <Interactable.View
          ref={ref => this.interactable = ref}
          horizontalOnly={true}
          snapPoints={snapPoints}
          animatedValueX={this.props.switchXOffset}
          onSnap={event => {
            this.handleCurrencySwitch(currencies[event.nativeEvent.index].code)
          }}>

          <View style={styles.coinWrapper}>

            {currencies.map(currency => (
              <TouchableWithoutFeedback
                key={`currency${currency.code}`}
                onPress={() => {
                  this.interactable.snapTo({index: currency.index})
                }}>
                <Animated.View
                  style={{
                    ...styles.coin,
                    opacity: this.props.switchXOffset.interpolate({
                      inputRange: [
                        -1 * (SCREEN_WIDTH/2-45) * (currency.index+1), 
                        -1 * (SCREEN_WIDTH/2-45) * (currency.index),
                        -1 * (SCREEN_WIDTH/2-45) * (currency.index-1)],
                      outputRange: [0.5, 1, 0.5]
                    }),
                    transform: [
                      {scale: Animated.multiply(
                        this.props.yOffsets.home.interpolate({
                          inputRange: [-81, -80, 0, 60, 160, 161],
                          outputRange: [1.2, 1.2, 1, 0.95, 0.2, 0.2]
                        }),
                        this.props.switchXOffset.interpolate({
                          inputRange: [
                            -1 * (SCREEN_WIDTH/2-45) * (currency.index+1), 
                            -1 * (SCREEN_WIDTH/2-45) * (currency.index),
                            -1 * (SCREEN_WIDTH/2-45) * (currency.index-1)],
                          outputRange: [0.8, 1, 0.8]
                        })
                      )},
                    ]
                  }}>
                  <Image
                    source={currency.image}
                    resizeMode="contain"
                    style={styles.coinImage}/>
                  <Text style={styles.coinText}>{currency.code}</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            ))}

          </View>

        </Interactable.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  coinWrapper: {
    flexDirection: "row",
    paddingLeft: (SCREEN_WIDTH - 100)/2,
    paddingRight: 50,
    // backgroundColor: colors.primary,
    width: "auto",
    justifyContent: "space-between"
  },
  coin: {
    width: 100,
    height: 120,
    marginRight: (SCREEN_WIDTH - 100)/2 - 95,
  },
  coinImage: {
    width: 100,
    height: 100,
  },
  coinText: {
    width: 100,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "500",
    color: colors.white,
    marginTop: 5,
  },
  container: {
    position: "absolute",
    top: isIphoneX() ? 175 : 155,
  }
})

const mapStateToProps = state => {
  return {
    
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrencySwitch)
