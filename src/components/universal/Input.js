import React from 'react'
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"

export const Input = ({onChange, value, placeholder, name,...inputProps, input}) => {

	return (
			<TextInput 
				{...inputProps}
				onChangeText={ input.onChange } 
				name={name} value={value} 
				placeholder={placeholder} 
				style={[styles.input]}
				onBlur={input.onBlur}
        onFocus={input.onFocus}
        value={input.value}
        />
			
		)
}

export const MultiInput = ({onChange, inputPosition, value, placeholder, name,...inputProps, input}) => {
	
	const inputStyle = [styles.multiInput]
	if (inputPosition == 'firstInput') {
		inputStyle.push(styles.firstInput)
	} else if (inputPosition == 'lastInput') {
		inputStyle.push(styles.lastInput)
	}

	return (
				<TextInput 
					{...inputProps}
					onChangeText={ input.onChange } 
					name={name} value={value} 
					placeholder={placeholder} 
					style={[inputStyle, inputStyle == 'firstInput' : styles.firstInput, inputStyle == 'lastInput' : style.lastInput]}
					onBlur={input.onBlur}
					// style={styles.multiInput}
	        onFocus={input.onFocus}
	        value={input.value}
        />	
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
	},
	multiInput: {
		padding: 20,
		fontSize: 20,
		backgroundColor: colors.white,
	},
	firstInput: {
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
	},
	lastInput: {
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
	}

})



