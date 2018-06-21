import React from 'react'
import {
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import { isIphoneX } from "react-native-iphone-x-helper"
import {defaults} from '../../lib/styles'

const FlatBackButton = ({onPress, color="gray", absolute=true, direction="left"}) => {

    let source
    if (direction == "left") {
        switch (color) {
            case "gray":
                source = require("../../assets/icons/leftCarrotGray.png")
                break
            case "dark":
                source = require("../../assets/icons/leftCarrotDark.png")
                break
            case "white":
                source = require("../../assets/icons/leftCarrotWhite.png")
                break
            default:
                source = require("../../assets/icons/leftCarrotWhite.png")
                break
        }
    } 
    if (direction == "right") {
        source = require("../../assets/icons/rightCarrotWhite.png")
    }
        

	return (
		<TouchableOpacity onPress={ onPress } style={[
            styles.wrapper,
            (absolute && direction == "left") ? styles.absoluteLeft : {},
            (absolute && direction == "right") ? styles.absoluteRight : {},
        ]}>
            <Image source={source} style={styles.carrot} />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 27,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },
    absoluteLeft: {
        position: 'absolute',
        left: 0,
        top: (isIphoneX()) ? 30 : 10,
    },
    absoluteRight: {
        position: 'absolute',
        right: 0,
        top: 30,
    },
    carrot: {
        height: 22,
        width: 11,
    }
})

export default FlatBackButton
