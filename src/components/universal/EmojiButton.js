import React from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from '../../lib/styles'

const EmojiButton = ({onPress, emoji, title=null}) => {

	if (title != null) {
        return (
            <TouchableOpacity onPress={ onPress } style={[styles.base, styles.titled]}>
                <Text style={styles.text}>
                    {title} {emoji}
                </Text>
            </TouchableOpacity>
        )
	}
	else {
        return (
            <TouchableOpacity onPress={ onPress } style={[styles.base]}>
                <Text style={styles.text}>
                    {emoji}
                </Text>
            </TouchableOpacity>
        )
	}

}


const styles = StyleSheet.create({
	base: {
		shadowColor: colors.lightShadow,
		shadowOffset: defaults.shadowOffset,
		shadowOpacity: 0.15,
		shadowRadius: defaults.shadowRadius,
		borderRadius: 20,
		minWidth: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: "center",
	},
	titled: {
		padding: 10,
		paddingLeft: 12,
		shadowOpacity: defaults.shadowOpacity
	},
	text: {
		fontSize: 14,
		textAlign: 'center',
		color: colors.nearBlack
	}
})

export default EmojiButton