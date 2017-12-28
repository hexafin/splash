import React from 'react'
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import { Field } from 'redux-form'
import PropTypes from 'prop-types'
export const Input = ({onChange, secureTextEntry, value, placeholder, name,...inputProps, input}) => {

	return (
			<TextInput
				{...inputProps}
				onChangeText={ onChange }
				name={name} value={value}
				placeholder={placeholder}
				style={[styles.input]}
				onBlur={input.onBlur}
				secureTextEntry={secureTextEntry}
        onFocus={input.onFocus}
        value={input.value}
        />

		)
}

export const MultiInput = ({onChange, secureTextEntry, inputPosition, value, placeholder, name,...inputProps, input}) => {

	const inputStyle = [styles.multiInput]
	if (inputPosition == 'firstInput') {
		inputStyle.push(styles.firstInput)
	} else if (inputPosition == 'lastInput') {
		inputStyle.push(styles.lastInput)
	}

	return (
				<TextInput
					{...inputProps}
					onChangeText={ onChange } 
					name={name} value={value}
					placeholder={placeholder}
					style={[inputStyle, inputStyle == 'firstInput' : styles.firstInput, inputStyle == 'lastInput' : style.lastInput]}
					onBlur={input.onBlur}
					secureTextEntry={secureTextEntry}
					// style={styles.multiInput}
	        onFocus={input.onFocus}
	        value={input.value}
        />
		)
}


/**
* MultiInputBlock
* @param inputs = array of objects with the following properties
* 	name: String: input-name --> this will be the name in the redux store
* 	placeholder: String: input-placeholder  --> visible placeholder
*
**/
export const MultiInputBlock = ({inputs, secureTextEntry}) => {
	const renderInputs = inputs.map((field, index) => {
		let inputPosition = null
		if (index == 0) {
			inputPosition = 'firstInput'
		} else if (index == inputs.length - 1) {
			inputPosition = 'lastInput'
		} else {
			inputPosition = null
		}
		return <Field
							name={field.name}
							key={index}
							placeholder={field.placeholder}
							component={MultiInput}
							inputPosition={inputPosition}
							secureTextEntry={secureTextEntry}
                            autoCorrect={false}
							spellCheck={false}
					 />
	})
	return (
			<View style={styles.multiInputContainer}>
				{renderInputs}
			</View>
		)
}

MultiInputBlock.propTypes = {
   inputs: PropTypes.arrayOf(PropTypes.shape({
     name: PropTypes.string.isRequired,
     placeholder: PropTypes.string.isRequired,
   })).isRequired,
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
	},
	 multiInputContainer: {
        ...defaults.shadow,
        backgroundColor: 'rgba(63,63,63, 0)',
    }

})
