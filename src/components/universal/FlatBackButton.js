import React from 'react'
import {
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from '../../lib/styles'

const FlatBackButton = ({onPress, color="gray", absolute=true}) => {

    const source = (color == "gray") 
        ? require("../../assets/icons/leftCarrotGray.png") 
        : require("../../assets/icons/leftCarrotWhite.png")

	return (
		<TouchableOpacity onPress={ onPress } style={[
            styles.wrapper,
            (absolute) ? styles.absolute : {}
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
    absolute: {
        position: 'absolute',
        // backgroundColor: "blue",
        left: 0,
        top: 30,
    },
    carrot: {
        height: 20,
        width: 10,
        margin: 5
    }
})

export default FlatBackButton
