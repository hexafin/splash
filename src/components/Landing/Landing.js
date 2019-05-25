import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
    TouchableOpacity,
    TouchableWithoutFeedback
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import { Input } from "../universal/Input";
import AnimatedWaves from "../universal/AnimatedWaves";
import TouchID from 'react-native-touch-id'
import Button from "../universal/Button"

class Landing extends Component {

    constructor(props) {
        super(props)
        this.handlePress = this.handlePress.bind(this)
    }

    componentWillMount() {
        if (this.props.loggedIn) {
            this.props.navigation.navigate("Home");
        }
    }

    handlePress() {
        if (this.props.splashtagOnHold && this.props.phoneNumber) {
            this.props.SmsAuthenticate(this.props.phoneNumber, null);
        } else if (this.props.splashtagOnHold) {
            this.props.navigation.navigate("EnterPhoneNumber");
        } else {
            this.props.navigation.navigate("ChooseSplashtag");
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <AnimatedWaves/>

                {!this.props.splashtagOnHold && (
                    <View style={styles.header}>
                        <View style={styles.logoWrapper}>
                            <Image
                                source={require("../../assets/images/splash-logo.png")}
                                style={styles.logo}
                            />
                            <Text style={styles.logoText}>Splash</Text>
                        </View>
                        <View style={styles.slogan}>
                            <Text style={styles.sloganText}>
                                Splash is your wallet
                            </Text>
                            <Text style={styles.sloganSubText}>
                                Make it personal with a splashtag
                            </Text>
                        </View>
                    </View>
                )}

                {this.props.splashtagOnHold && (
                    <View style={styles.claimedHeader}>
                        <View style={styles.leftLogoWrapper}>
                            <Image
                                source={require("../../assets/images/splash-logo.png")}
                                style={styles.logo}
                            />
                            <Text style={styles.logoText}>Splash</Text>
                        </View>
                        <View style={styles.slogan}>
                            <Text style={styles.sloganText}>Welcome,</Text>
                            <Text style={styles.sloganText}>
                                @{this.props.splashtagOnHold}
                            </Text>
                            <Text style={styles.sloganSubText}>
                                Nice to see you again!
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.footer}>
                    <Button
                        onPress={this.handlePress}
                        title={"Get started"}
                        primary={false}/>
                </View>
                {this.props.splashtagOnHold && (
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate("ChooseSplashtag")
                        }
                    >
                        <Text style={styles.newSplash}>
                            Or choose a new one...
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
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
        flexDirection: "column"
    },
    claimedHeader: {
        flex: 1,
        paddingVertical: 30,
        paddingHorizontal: 20,
        flexDirection: "column"
    },
    logoWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 63
    },
    leftLogoWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 63
    },
    logo: {
        height: 30,
        width: 22.5,
        margin: 5
    },
    logoText: {
        fontSize: 22,
        paddingBottom: 4,
        fontWeight: "400",
        color: colors.nearBlack
    },
    slogan: {
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
        marginTop: 30
    },
    sloganText: {
        fontSize: 32,
        fontWeight: "500",
        color: colors.nearBlack,
        textAlign: "center"
    },
    sloganSubText: {
        marginTop: 20,
        fontSize: 22,
        textAlign: "center",
        color: colors.lightGray
    },
    footer: {
        padding: 20,
        marginBottom: 10
    },
    footerButton: {
        backgroundColor: colors.white,
        borderRadius: 5,
        flex: 1,
        padding: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    footerButtonText: {
        fontSize: 22,
        color: colors.purple
    },
    splashField: {
        marginTop: 85
    },
    newSplash: {
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0)",
        color: colors.white,
        textDecorationLine: "underline",
        fontSize: 17,
        paddingBottom: 15
    }
});

export default Landing;
