import React from 'react'
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"

export const Input = ({onChange, value, placeholder, name}) => {

	return (
			<TextInput onChangeText={ onChange } name={name} value={value} placeholder={placeholder} style={[styles.input]}>
			 	</TextInput>
		)
}

export const MultiInput = ({inputs, on}) => {
	const handleFormChange = (name) => (value) => {
  

  }

	
	return (
			<View >
				<TextInput />
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



