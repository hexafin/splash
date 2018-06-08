import React from 'react'
import {
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from '../../lib/styles'

const FlatBackButton = ({onPress, color="gray", absolute=true, direction="left"}) => {

    let source
    if (direction == "left") {
        source = color == "gray" ? require("../../assets/icons/leftCarrotGray.png") : require("../../assets/icons/leftCarrotWhite.png")
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
        padding: 10,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },
    absoluteLeft: {
        position: 'absolute',
        left: 0,
        top: 30,
    },
    absoluteRight: {
        position: 'absolute',
        right: 0,
        top: 30,
    },
    carrot: {
        height: 20,
        width: 10,
        margin: 5
    }
})

export default FlatBackButton
