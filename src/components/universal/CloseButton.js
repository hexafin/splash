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
import { isIphoneX } from "react-native-iphone-x-helper"
import PropTypes from "prop-types"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

class CloseButton extends Component {

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

        const { onPress, color="white" } = this.props

        let icon
        switch(color) {
            case "white":
                icon = icons.crossWhite
                break;
            case "gray":
                icon = icons.crossGray
                break;
            case "primary":
                icon = icons.crossPrimary
        }

        return (
                <TouchableWithoutFeedback
                        onPress={ onPress }
                        onPressIn={this.handlePressIn}
                        onPressOut={this.handlePressOut}>
                    <Animated.View style={[
                        styles.wrapper,
                        {
                            transform: [{scale: this.animatedValue}]
                        }
                    ]}>
                        <Image source={icon} style={styles.icon} resizeMode="contain"/>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )

    }

}

CloseButton.propTypes = {
    onPress: PropTypes.func,
}


const styles = StyleSheet.create({
	wrapper: {
        position: "absolute",
        top: (isIphoneX()) ? 30 : 10,
        padding: 30,
        right: 0
    },
    icon: {
        width: 20,
        height: 20
    }
})

export default CloseButton
