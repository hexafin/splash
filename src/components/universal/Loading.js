import React, {Component} from "react"
import {Actions} from "react-native-router-flux";
import {connect} from "react-redux";
import {
    View,
    StyleSheet,
    Image
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"


const Loading = () => {
    return (
        <View style={styles.container}>
            <Image style={styles.loadingLogo} source={require("../../lib/images/splash-logo-xlarge.png")}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center"
    },
    loadingLogo: {
        width: 400,
        height: 400
    },
    landingButton: {
        flex: 1
    }
})

export default Loading
