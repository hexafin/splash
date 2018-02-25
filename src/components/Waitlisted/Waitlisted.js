import React, {Component} from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"

class Waitlisted extends Component {

    render() {

        return (
            <View style={styles.container}>

                <Image style={styles.wavesImage}
                    source={require("../../assets/images/waves.png")}/>

                <View style={styles.header}>
                    <View style={styles.logoWrapper}>
                        <Image source={icons.splash}
                            style={styles.logo}/>
                        <Text style={styles.logoText}>Splash</Text>
                    </View>
                </View>


            </View>
        )

    }

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
    header: {
        flex: 1,
        padding: 30,
        flexDirection: "column",
    },
    logoWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },
    logo: {
        height: 36,
        width: 28,
        marginRight: 10
    },
    logoText: {
        fontSize: 28,
        paddingBottom: 4,
        fontWeight: '400',
        color: colors.nearBlack
    }
})

export default Waitlisted
