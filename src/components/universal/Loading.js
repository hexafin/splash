import React, {Component} from "react"
import {Actions} from "react-native-router-flux";
import {connect} from "react-redux";
import {
    View,
    StyleSheet,
    Image
} from "react-native"
import {defaults} from "../../lib/styles"


const Loading = () => {
    return (
        <View style={styles.container}>
            {/*<Image style={styles.wavesImage} source={require("../../assets/images/waves.png")}/>*/}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        justifyContent: "space-between",
        position: "relative"
    },
    wavesImage: {
        position: "absolute",
        bottom: -50,
        left: 0,
        right: 0,
        width: 400,
        height: 400
    },
})

export default Loading
