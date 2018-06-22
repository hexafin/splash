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

import LinearGradient from 'react-native-linear-gradient'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const xOffset = new Animated.Value(0)

class Landing extends Component {
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

        return (
            <Animated.View style={[styles.container]}>
                <LottieView
                    source={require('../../assets/animations/gradientLanding.json')}
                    style={{
                        height: SCREEN_HEIGHT,
                        width: SCREEN_WIDTH,
                        position: 'absolute'
                    }}
                    ref={animation => {
                        this.animation = animation
                    }}
                    progress={progress}
                    loop={true}
                    autoplay={true}
                />
                <Animated.ScrollView
                    scrollEventThrottle={16}
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
                        text="Splash is your cryptocurrency Wallet"
                        index={0}
                    />
                    <Screen
                        text="Spend, send, receive Crypto - anywhere."
                        index={1}
                    />
                    <Screen text="Just sign up already." index={2} />
                </Animated.ScrollView>

                <View style={styles.dotContainer}>{dots}</View>
                <View style={styles.button}>
                    <Button title="Create your wallet" />
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        bottom: SCREEN_HEIGHT / 3,
        left: 50,
        flexDirection: 'row'
    },
    headerContainer: {
        position: 'absolute',
        bottom: SCREEN_HEIGHT / 2.4,
        left: 50
    },
    button: {
        marginBottom: 50,
        // display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center'
    },
    dot: {
        backgroundColor: 'white',
        height: 10,
        width: 10,
        borderRadius: 100,
        marginRight: 15
    },
    screen: {
        height: 600,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'white'
    }
})

const Screen = props => {
    return (
        <View style={Screenstyles.scrollPage}>
            <View style={Screenstyles.screen}>
                <Text style={Screenstyles.text}>{props.text}</Text>
            </View>
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
        marginLeft: 50,
        bottom: SCREEN_HEIGHT / 3,
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

export default Landing
