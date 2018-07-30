import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Alert,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
    processColor
} from 'react-native'
import { colors } from '../../lib/colors'
import { defaults, icons } from '../../lib/styles'
import { Input } from '../universal/Input'
import TouchID from 'react-native-touch-id'
import Button from '../universal/Button'
import LottieView from 'lottie-react-native'
import NextButton from '../universal/NextButton'
import { isIphoneX } from 'react-native-iphone-x-helper'
import LinearGradient from 'react-native-linear-gradient'
const image1 = require('../../assets/images/screen-view1.png')
const image2 = require('../../assets/images/screen-view2.png')
const image3 = require('../../assets/images/screen-view3.png')
const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const xOffset = new Animated.Value(0)

class LandingSwipeView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const progress = xOffset.interpolate({
            inputRange: [0, 750],
            outputRange: [0.2, 0.8]
        })

        let dots = []
        for (let i = 0; i < 3; i++) {
            const dotOpacity = xOffset.interpolate({
                inputRange: [
                    (i - 1) * SCREEN_WIDTH,
                    i * SCREEN_WIDTH,
                    (i + 1) * SCREEN_WIDTH
                ],
                outputRange: [0.25, 1, 0.25],
                extrapolate: 'clamp'
            })

            const thisDot = (
                <Animated.View
                    key={`${i}-dot`}
                    style={[
                        styles.dot,
                        {
                            opacity: dotOpacity
                        }
                    ]}
                />
            )
            dots.push(thisDot)
        }

        let images = []
        for (let i = 0; i < 3; i++) {
            const dotOpacity = xOffset.interpolate({
                inputRange: [
                    (i - 1) * SCREEN_WIDTH,
                    i * SCREEN_WIDTH,
                    (i + 1) * SCREEN_WIDTH
                ],
                outputRange: [0, 1, 0],
                extrapolate: 'clamp'
            })

            const thisImage = (
                <Animated.View
                    key={`${i}-dot`}
                    style={[
                        styles.image,
                        {
                            opacity: dotOpacity
                        }
                    ]}
                >
                    {i == 0 && (
                        <Image source={image1} style={styles.imageStyle} />
                    )}
                    {i == 1 && (
                        <Image source={image2} style={styles.imageStyle} />
                    )}
                    {i == 2 && (
                        <Image source={image3} style={styles.imageStyle} />
                    )}
                </Animated.View>
            )
            images.push(thisImage)
        }

        return (
            <Animated.View style={[styles.container]}>
                <View style={styles.imageContainer}>{images}</View>

                <View style={styles.dotContainer}>{dots}</View>

                <Animated.ScrollView
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: { x: xOffset }
                                }
                            }
                        ],
                        { useNativeDriver: true }
                    )}
                    horizontal
                    pagingEnabled
                >
                    <Screen
                        text="Splash is your cryptocurrency wallet."
                        index={0}
                    />
                    <Screen
                        text={`Send money to anyone.\nBuy anything.`}
                        index={1}
                    />
                    <Screen
                        text={`Bye, bye big banks.\nHello Splash.`}
                        index={2}
                    />
                </Animated.ScrollView>

                <View style={styles.button}>
                    <Button
                        onPress={() =>
                            this.props.navigation.navigate('ChooseSplashtag')
                        }
                        round
                        large
                        title="Get your wallet"
                    />
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary
    },
    scrollView: {
        flexDirection: 'row',
        flex: 1
    },
    scrollPage: {
        width: SCREEN_WIDTH,
        padding: 20
    },
    dotContainer: {
        position: 'absolute',
        zIndex: 2,
        top: isIphoneX() ? SCREEN_HEIGHT * 0.2 : SCREEN_HEIGHT * 0.18,
        left: 50,
        flexDirection: 'row'
    },
    imageContainer: {
        position: 'absolute',
        zIndex: 0,
        bottom: 0,
        flex: 1,
        backgroundColor: 'yellow'
    },
    image: {
        position: 'absolute',
        bottom: 0
    },
    imageStyle: {
        height: SCREEN_HEIGHT - SCREEN_HEIGHT * 0.211,
        width: SCREEN_WIDTH,
        bottom: isIphoneX() ? 0 : -20,
        right: 0
    },
    headerContainer: {
        position: 'absolute',
        bottom: SCREEN_HEIGHT / 2.4,
        left: 50
    },
    button: {
        marginBottom: isIphoneX() ? SCREEN_HEIGHT * 0.1 : SCREEN_HEIGHT * 0.05,
        alignItems: 'center'
    },
    dot: {
        backgroundColor: 'white',
        height: 15,
        width: 15,
        borderRadius: 100,
        marginRight: 15
    }
})

const Screen = props => {
    return (
        <View style={Screenstyles.scrollPage}>
            <View style={Screenstyles.screen}>
                <Text style={Screenstyles.text}>{props.text}</Text>
            </View>
            {props.children}
        </View>
    )
}

const Screenstyles = StyleSheet.create({
    scrollPage: {
        width: SCREEN_WIDTH,
        flex: 1,
        justifyContent: 'center'
    },
    screen: {
        margin: 50,
        top: isIphoneX() ? SCREEN_HEIGHT * 0.05 : 0,
        position: 'absolute',
        width: '70%'
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        position: 'absolute',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        flex: 1
    }
})

export default LandingSwipeView
