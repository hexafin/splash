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
import {defaults} from '../../lib/styles'
import LoadingCircle from "../universal/LoadingCircle"
import Checkmark from "../universal/Checkmark"
import PropTypes from "prop-types"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

class SplashtagButton extends Component {

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

        const {onPress=()=>{}, user, style={}} = this.props

        let styleArray = [style, styles.wrapper,
            {
                transform: [{scale: this.animatedValue}]
            }
        ]

        return (
                <TouchableWithoutFeedback
                        onPress={ onPress }
                        onPressIn={this.handlePressIn}
                        onPressOut={this.handlePressOut}>
                    <Animated.View style={styleArray}>
                        <Text style={styles.splashtag}>@{user.splashtag}</Text>
                        <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )

    }

}

const styles = StyleSheet.create({
	wrapper: {
        marginTop: 20,
        backgroundColor: colors.primary,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        marginTop: 15,
        borderRadius: 5
    },
    splashtag: {
        color: colors.white,
        fontWeight: "700",
        fontSize: 22
    },
    phoneNumber: {
        color: colors.white,
        fontWeight: "700",
        fontSize: 20
    },
    
})

export default SplashtagButton
