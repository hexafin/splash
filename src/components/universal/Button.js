import React from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"

const Button = ({primary, onPress, title}) => {
  const {base, buttonPrimary, buttonSecondary} = styles
	const combineStyles = StyleSheet.flatten([base, buttonPrimary])

	return (
			<TouchableOpacity onPress={ onPress } style={[base, primary ? buttonPrimary : buttonSecondary]}>
			 	<Text style={[styles.text, primary ? styles.textPrimary : styles.textSecondary]}> 
			 		{title} 
			 	</Text>
			</TouchableOpacity>
		)
}


const styles = StyleSheet.create({
	base: {
		shadowColor: colors.lightShadow,
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.1,
		shadowRadius: 24,
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