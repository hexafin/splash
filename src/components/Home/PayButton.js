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

class PayButton extends Component {

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

        const {onPress=()=>{}, textOnly=false, title, image, disabled=false, loading=false, style={}} = this.props

        let styleArray = [style,
            {
                transform: [{scale: this.animatedValue}]
            }
        ]
        if (textOnly) {
            styleArray.push(styles.textOnly)
        }
        else {
            styleArray.push(styles.wrapper)
        }

        return (
                <TouchableWithoutFeedback
                        onPress={ onPress }
                        onPressIn={this.handlePressIn}
                        onPressOut={this.handlePressOut}>
                    <Animated.View style={styleArray}>
                        {!textOnly && <View style={styles.titleWrapper}>
                            <Image source={image} style={styles.image} resizeMode="contain"/>
                            <Text style={styles.title}>{title}</Text>
                        </View>}
                        {textOnly && <Text style={styles.textOnlyText}>{title}</Text>}
                    </Animated.View>
                </TouchableWithoutFeedback>
            )

    }

}

const styles = StyleSheet.create({
	wrapper: {
        marginTop: 20,
        backgroundColor: colors.primary,
        padding: 15,
        justifyContent: "center",
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
    titleWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        color: colors.white,
        fontWeight: "700",
        fontSize: 22
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 10
    },
    textOnly: {
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    textOnlyText: {
        color: colors.gray,
        fontSize: 18,
        fontWeight: "700"
    }
})

export default PayButton
