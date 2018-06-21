import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults, icons} from '../../lib/styles'
import {isIphoneX} from "react-native-iphone-x-helper"
import LoadingCircle from "./LoadingCircle"
import Checkmark from "./Checkmark"
import PropTypes from "prop-types"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

class NextButton extends Component {

    constructor(props) {
        super(props)
        this.handlePressIn = this.handlePressIn.bind(this)
        this.handlePressOut = this.handlePressOut.bind(this)
    }

    componentWillMount() {
        this.animatedValue = new Animated.Value(1)
    }

    handlePressIn() {
        ReactNativeHapticFeedback.trigger("impactLight", true)
        Animated.spring(this.animatedValue, {
            toValue: .8
        }).start()
    }

    handlePressOut() {
        ReactNativeHapticFeedback.trigger("impactLight", true)
        Animated.spring(this.animatedValue, {
            toValue: 1,
            friction: 3,
            tension: 40
        }).start()
    }

    render() {

        const {
            title,
            disabled=false,
            onPress=()=>{},
        } = this.props

        return (
                <TouchableWithoutFeedback
                    disabled={ disabled }
                    onPress={ onPress }
                    onPressIn={this.handlePressIn}
                    onPressOut={this.handlePressOut}
                >
                    <Animated.View style={[
                        styles.wrapper,
                        {transform: [{scale: this.animatedValue}]}
                    ]}>
                        <View style={[styles.button, (disabled ? styles.disabled : {})]}>
                            <Text style={styles.text}>{this.props.title}</Text>
                            <Image source={icons.rightCarrotWhite} style={styles.icon} resizeMode="contain"/>
                        </View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )

    }

}


const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: isIphoneX() ? 40 : 20,
        right: 20,
    },
    button: {
        paddingHorizontal: 30,
        paddingVertical: 25,
        backgroundColor: colors.primary,
        borderRadius: 40,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowColor: colors.primaryShadow,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    disabled: {
        backgroundColor: colors.primaryGray,
    },
    text: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.white,
    },
    icon: {
        width: 10,
        height: 20,
        marginLeft: 20,
    },
})

export default NextButton