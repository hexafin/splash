import React from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from '../../lib/styles'

const EmojiButton = ({onPress, emoji, style}) => {



	return (
			<TouchableOpacity onPress={ onPress } style={[styles.base, style]}>
			 	<Text style={styles.text}>
					{emoji}
			 	</Text>
			</TouchableOpacity>
		)
}


const styles = StyleSheet.create({
	base: {
		shadowColor: colors.lightShadow,
		shadowOffset: defaults.shadowOffset,
		shadowOpacity: 0.15,
		shadowRadius: defaults.shadowRadius,
		borderRadius: 20,
		width: 40,
		height: 40,
		margin: 10,
		justifyContent: 'center',
		alignItems: "center",
	},
	text: {
		fontSize: 20,
		textAlign: 'center',
	}
})

export default EmojiButton