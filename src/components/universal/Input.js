import React from 'react'
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"

export const Input = ({onChangeText, value, placeholder}) => {

	return (
			<TextInput onChangeText={ onChangeText } value={value} placeholder={placeholder} style={[styles.input]}>
			 	</TextInput>
		)
}

export const MultiInput = ({children, on}) => {
	const inputs = children.map((input) => {
		return input
	})
	console.log('inputs', inputs)
	return (
			<View >
			</View>

		)
}



const styles = StyleSheet.create({
	input: {
		shadowColor: colors.lightShadow,
		shadowOffset: defaults.shadowOffset,
		shadowOpacity: defaults.shadowOpacity,
		shadowRadius: defaults.shadowRadius,
		borderRadius: 5,
		padding: 20,
		fontSize: 20,
	}
})



