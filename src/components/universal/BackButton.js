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


const BackButton = ({onPress, type="left"}) => {

    return (
        <TouchableOpacity
            style={[styles.baseBackButton, type == "left" ? styles.leftBackButton : styles.rightBackButton]}
            onPress={onPress}>
            <Icon name={type == "left" ? "chevron-left" : "cross"} color={colors.gray} size={25}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    baseBackButton: {
        position: "absolute",
        top: 30,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: colors.lightShadow,
        shadowOffset: defaults.shadowOffset,
        shadowOpacity: 0.25,
        shadowRadius: defaults.shadowRadius,
        zIndex: 100,
        width: 35,
        height: 35,
        borderRadius: 25,
        padding: 5,
        backgroundColor: colors.white,
    },
    leftBackButton: {
        left: 20
    },
    rightBackButton: {
        right: 20
    },
    backButtonText: {
        color: colors.gray,
        fontWeight: "500"
    }
})

export default BackButton