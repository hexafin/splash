import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Easing,
    TouchableOpacity,
    TouchableWithoutFeedback
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import { Input } from "../universal/Input";
import Ring from "../universal/Ring";
import firebase from "react-native-firebase";
import AnimatedWaves from "../universal/AnimatedWaves";
import TouchID from 'react-native-touch-id'

class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
          yPos: new Animated.Value(-200),
          opacity: new Animated.Value(0),
        }
    }

    componentDidMount() {

        Animated.sequence([
          Animated.spring(this.state.yPos, {
            toValue: 0,
            friction: 8,
          }),
          Animated.timing(this.state.opacity, {
            toValue: 1,
            easing: Easing.linear(),
            duration: 200,
          })
        ]).start()

        if (this.props.smsAuthenticated) {
            this.props.navigation.navigate("Waitlisted");
        }

        firebase
            .links()
            .getInitialLink()
            .then(url => {
                if (url) {
                    this.handleDeepLink({ url: url });
                }
            });
    }

    handleDeepLink = event => {
        if (event.url) {
            const parts = event.url.split("/");
            const splashtag = parts[3];
            const phoneNumber = parts[4];

            if (
                !(
                    splashtag == this.props.splashtagOnHold &&
                    phoneNumber == this.props.phoneNumber
                )
            ) {
                this.props.getDeepLinkedSplashtag(splashtag, phoneNumber);
            }
        }
    };

    handleClaim = () => {
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
              <Animated.View style={[styles.centerButton, {opacity: this.state.opacity}]}>
                <TouchableOpacity onPress={this.handleClaim} style={{alignItems: 'center'}}>
                  <Ring size={108} ringSecondary={"#EFEFFD"} ringRatio={0.75}>
                      <Image source={require("../../assets/images/smile-splash.png")} style={styles.topSplash}/>
                  </Ring>
                  <Text style={styles.enterText}>Touch to enter</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={[styles.footer, {bottom: this.state.yPos}]}>
                <Image source={require("../../assets/images//smile-splash-white.png")} style={styles.bottomSplash}/>
                {!this.props.splashtagOnHold && <Text style={styles.footerText}>Welcome to Splash!</Text>}
                {this.props.splashtagOnHold && <Text style={styles.footerText}>Welcome to Splash,{'\n'}@{this.props.splashtagOnHold}</Text>}
              </Animated.View>
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
    centerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topSplash: {
        width: 44,
        height: 57
    },
    enterText: {
      paddingTop: 7,
      color: colors.lightGray,
      fontSize: 20.16,
      backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    bottomSplash: {
        position: 'relative',
        left: -20,
        bottom: -10,
        width: 84,
        height: 84
    },
    wavesImage: {
        position: "absolute",
        bottom: -50,
        left: 0,
        right: 0,
        width: 400,
        height: 400
    },
    footer: {
        position: "absolute",
        paddingHorizontal: 30,
        marginBottom: 50
    },
    footerText: {
      color: colors.nearBlack,
      backgroundColor: "rgba(0, 0, 0, 0)",
      fontWeight: "500",
      fontSize: 27
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
