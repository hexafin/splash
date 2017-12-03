// presentational component for splash page

import React from "react"
import {
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"

import {Actions} from "react-native-router-flux"


const BackButton = ({onPress}) => {
    return (
        <TouchableOpacity style={styles.backButton} onPress={onPress}>
            <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    backButton: {
        marginBottom: 15,
        marginLeft: 5
    },
    backButtonText: {
        color: colors.gray,
        fontWeight: "500"
    }
})

export default BackButton