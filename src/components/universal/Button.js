import React from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from '../../lib/styles'

const Button = ({primary, onPress, title, disabled}) => {

	return (
			<TouchableOpacity disabled={ disabled } onPress={ onPress } style={[styles.base, primary ? styles.buttonPrimary : styles.buttonSecondary]}>
			 	<Text style={[styles.text, primary ? styles.textPrimary : styles.textSecondary]}>
			 		{title}
			 	</Text>
			</TouchableOpacity>
		)
}


const styles = StyleSheet.create({
	base: {
		shadowColor: colors.lightShadow,
		shadowOffset: defaults.shadowOffset,
		shadowOpacity: defaults.shadowOpacity,
		shadowRadius: defaults.shadowRadius,
		borderRadius: 5,
		padding: 20,
		justifyContent: 'center',
	},
	text: {
		fontSize: 20,
		textAlign: 'center',
		fontWeight: '600',
	},
	textSecondary: {
		color: colors.purple,
	},
	textPrimary: {
		color: colors.white,
	},
	buttonPrimary: {
		backgroundColor: colors.purple,
	},
	buttonSecondary: {
		backgroundColor: colors.white
	}
})

export default Button