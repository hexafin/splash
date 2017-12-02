import React from 'react'
import {
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"

const Input = ({onChangeText, text, placeholder}) => {

	return (
			<TextInput onChangeText={ onChangeText } placeholder={placeholder} style={[styles.input]}>
			 	</TextInput>
		)
}



const styles = StyleSheet.create({
	input: {
		shadowColor: colors.lightShadow,
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.1,
		shadowRadius: 24,
		borderRadius: 5,
		padding: 20,
		fontSize: 20,
	}
})


export default Input

