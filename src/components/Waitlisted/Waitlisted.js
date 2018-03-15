import React, {Component} from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    Share
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"
import CircleButton from "./CircleButton"
import Ring from "../universal/Ring"

class Waitlisted extends Component {

    render() {

        return (
            <View style={styles.container}>

                <Image style={styles.wavesImage}
                    source={require("../../assets/images/waves.png")}/>

                <View style={styles.body}>
                    <Text style={styles.title}>
                        We{"'"}re excited to have you{"\n"}
                        onboard!
                    </Text>
                    <Text style={styles.subtitle}>
                        You{"'"}ve claimed your{"\n"}
                        splashtag and spot on the{"\n"}
                        waitlist.
                    </Text>

                    <View style={styles.ringWrapper}>
                        <Ring size={120}>
                            <Image source={require("../../assets/images/smile-splash.png")} style={styles.smileSplash}/>
                        </Ring>
                        <Text style={styles.splashtag}>@{this.props.splashtag}</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        We want to make the{"\n"}
                        experience as good as possible{"\n"}
                        and are onboarding users as{"\n"}
                        new spaces open up.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>
                        In the meantime
                    </Text>
                    <View style={styles.footerButtons}>
                        <CircleButton title={"Join the\ncommunity"} onPress={() => {
                            Linking.openURL("https://t.me/joinchat/EjQODwyF10VliZ4fQ0SL8Q")
                        }}>
                            <Image source={require("../../assets/images/telegram.png")} style={styles.telegramImage}/>
                        </CircleButton>
                        <CircleButton title={"Invite\nfriends"} onPress={() => {
                            Share.share({
                                url: "https://www.splashwallet.io",
                                message: "Try Splash, the best way to use cryptocurrency",
                                title: "Welcome to the future of crypto"
                            }).then(result => {
                                console.log("share result: ", result)
                            })
                        }}>
                            <Image source={require("../../assets/images/invite.png")} style={styles.inviteImage}/>
                        </CircleButton>
                        <CircleButton title={"Learn\nmore"} onPress={() => {
                            Linking.openURL("https://www.medium.com/splash-wallet")
                        }}>
                            <Image source={require("../../assets/images/medium.png")} style={styles.mediumImage}/>
                        </CircleButton>
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
        position: "relative",
        paddingTop: 64
    },
    wavesImage: {
        position: "absolute",
        bottom: -100,
        left: 0,
        right: 0,
        width: 400,
        height: 400
    },
    body: {
        flex: 1,
        padding: 30,
        flexDirection: "column",
        alignItems: 'center',
    },
    title: {
        fontSize: 23,
        fontWeight: '500',
        color: colors.nearBlack,
        backgroundColor: 'rgba(0,0,0,0)',
        marginBottom: 20,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 17,
        textAlign: "center",
        backgroundColor: 'rgba(0,0,0,0)',
        color: colors.nearBlack,
        marginBottom: 10,
    },
    ringWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 15
    },
    smileSplash: {
        width: 44,
        height: 57
    },
    splashtag: {
        color: colors.nearBlack,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        padding: 10
    },
    footer: {
        flexDirection: 'column',
        padding: 20
    },
    footerTitle: {
        color: colors.white,
        backgroundColor: 'transparent',
        fontSize: 18,
        marginBottom: 20,
        padding: 20,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    telegramImage: {
        width: 45,
        height: 45
    },
    inviteImage: {
        width: 25,
        height: 25
    },
    mediumImage: {
        width: 40,
        height: 40
    }
})

export default Waitlisted
