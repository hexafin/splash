import React from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from '../../lib/styles'
import LoadingCircle from "./LoadingCircle"
import PropTypes from "prop-types"

const Button = ({primary, onPress=()=>{}, title, disabled=false, loading=false, small=false, style={}}) => {

    const loadingView = (
        <LoadingCircle color={primary ? null : colors.purple} size={small ? 17 : 34}/>
    )

    const normalView = (
        <Text style={[
            styles.text,
            small ? styles.textSmall : {},
            primary ? styles.textPrimary : styles.textSecondary,
            disabled ? styles.textDisabled : {}
        ]}>
            {title}
        </Text>
    )

	return (
			<TouchableOpacity disabled={ disabled || loading }
                    onPress={ onPress }
                    style={[
                        styles.base,
                        small ? styles.baseSmall : {},
                        primary ? styles.buttonPrimary : styles.buttonSecondary,
                        disabled ? styles.buttonDisabled : {},
                        loading ? styles.buttonLoading : {},
                        style
                    ]}>
                <View style={styles.wrapper}>
                    {loading && loadingView}
                    {!loading && normalView}
                </View>
			</TouchableOpacity>
		)
}

Button.propTypes = {
    primary: PropTypes.bool,
    onPress: PropTypes.func,
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    small: PropTypes.bool,
    style: PropTypes.any
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
    baseSmall: {
        padding: 10
    },
    buttonLoading: {
        padding: 15
    },
	text: {
		fontSize: 20,
		textAlign: 'center',
		fontWeight: '600',
	},
    textSmall: {
        fontSize: 18
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
	},
    buttonDisabled: {
        backgroundColor: colors.lighterGray,
    },
    textDisabled: {
        color: colors.white
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    }
})

export default Button
