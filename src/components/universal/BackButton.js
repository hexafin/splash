// presentational component for splash page

import React from "react"
import {
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import Icon from "react-native-vector-icons/Entypo"
import {Actions} from "react-native-router-flux"
import {defaults} from "../../lib/styles";


const BackButton = ({onPress}) => {
    return (
        <TouchableOpacity style={styles.backButton} onPress={onPress}>
            <Icon name="chevron-left" color={colors.gray} size={25}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 30,
        left: 20,
        flexDirection: "column",
        justifyContent: "center",
        shadowColor: colors.lightShadow,
        shadowOffset: defaults.shadowOffset,
        shadowOpacity: defaults.shadowOpacity,
        shadowRadius: defaults.shadowRadius,
        zIndex: 100,
        width: 35,
        height: 35,
        borderRadius: 25,
        padding: 5,
        backgroundColor: colors.white,
    },
    backButtonText: {
        color: colors.gray,
        fontWeight: "500"
    }
})

export default BackButton