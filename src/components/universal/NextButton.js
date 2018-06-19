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
            onPress=()=>{},
        } = this.props

        return (
                <TouchableWithoutFeedback
                        onPress={ onPress }
                        onPressIn={this.handlePressIn}
                        onPressOut={this.handlePressOut}>
                    <Animated.View style={[
                        styles.wrapper,
                        {transform: [{scale: this.animatedValue}]}
                    ]}>
                        <View style={styles.button}>
                            <Text style={styles.text}>{this.props.title}</Text>
                        </View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )

    }

}


const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 20,
    },
    button: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        backgroundColor: colors.primary,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    text: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.white,
    },
})

export default NextButton