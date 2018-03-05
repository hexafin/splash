import React from "react"
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableWithoutFeedback
} from "react-native"
import {colors} from "../../lib/colors"
import PropTypes from "prop-types"


const CircleButton = ({title, image, onPress=()=>{}, children}) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.wrapper}>
                <View style={styles.imageWrapper}>
                    {children}
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

CircleButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    imageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 50,
        shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.08,
		shadowRadius: 24,
        backgroundColor: colors.white,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    image: {
        width: 40,
        height: 40
    },
    title: {
        color: colors.white,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        backgroundColor: 'transparent'
    }
})

export default CircleButton
