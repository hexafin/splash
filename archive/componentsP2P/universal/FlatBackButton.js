import React from 'react'
import {
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from '../../lib/styles'

const FlatBackButton = ({onPress}) => {

	return (
			<TouchableOpacity onPress={ onPress } style={styles.wrapper}>
                <Image style={styles.carrot}
                    source={require("../../assets/icons/left-carrot.png")}/>
			</TouchableOpacity>
		)
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        // backgroundColor: "blue",
        left: 0,
        top: 30,
        padding: 10,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },
    carrot: {
        height: 80,
        width: 40,
        margin: 5
    }
})

export default FlatBackButton
