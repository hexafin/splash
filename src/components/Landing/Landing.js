import React, {Component} from "react"
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"
import {Input} from "../universal/Input"
import firebase from 'react-native-firebase'

class Landing extends Component {

  componentDidMount() {

    // if (this.props.smsAuthenticated) {
    //   this.props.navigation.navigate("Waitlisted")
    // }

    firebase.links().getInitialLink().then((url) => {
        if(url) {
          this.handleDeepLink({'url': url})
        }
    });
  }

  handleDeepLink = (event) => {
    if (event.url) {
      const parts = (event.url).split('/')
      const splashtag = parts[3]
      const phoneNumber = parts[4]

      if (!(splashtag == this.props.splashtagOnHold && phoneNumber == this.props.phoneNumber)) {
        this.props.getDeepLinkedSplashtag(splashtag, phoneNumber)
      }
    }
  };

  handleClaim = () => {
    if (this.props.splashtagOnHold && this.props.phoneNumber) {
      this.props.SmsAuthenticate(this.props.phoneNumber, null)
    } else if (this.props.splashtagOnHold) {
      this.props.navigation.navigate("EnterPhoneNumber")
    } else {
      this.props.navigation.navigate("ChooseSplashtag")
    }
  }


    render() {

        return (<View style={styles.container}>

            <Image style={styles.wavesImage} source={require("../../assets/images/waves.png")}/>

            {!this.props.splashtagOnHold && <View style={styles.header}>
                <View style={styles.logoWrapper}>
                    <Image source={require("../../assets/images/splash-logo.png")} style={styles.logo}/>
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
            </View>}

            {this.props.splashtagOnHold && <View style={styles.claimedHeader}>
                <View style={styles.leftLogoWrapper}>
                    <Image source={require("../../assets/images/splash-logo.png")}
                        style={styles.logo}/>
                    <Text style={styles.logoText}>Splash</Text>
                </View>
                <View style={styles.slogan}>
                    <Text style={styles.sloganText}>
                        Welcome,
                    </Text>
                    <Text style={styles.sloganText}>
                        @{this.props.splashtagOnHold}
                    </Text>
                    <Text style={styles.sloganSubText}>
                        Nice to see you again!
                    </Text>
                </View>
            </View>}

            <View style={styles.floating}></View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={this.handleClaim}>
                    <Text style={styles.footerButtonText}>
                        Claim your splashtag
                    </Text>
                </TouchableOpacity>
            </View>

        </View>)

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
        flexDirection: "column",
    },
    centerLogoWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },
    leftLogoWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 30,
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
    },
    slogan: {
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
        marginTop: 30
    },
    sloganText: {
        fontSize: 34,
        fontWeight: '500',
        color: colors.nearBlack,
        textAlign: "center"
    },
    sloganSubText: {
        marginTop: 20,
        fontSize: 24,
        textAlign: "center",
        color: colors.lightGray
    },
    floating: {},
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
        fontSize: 24,
        color: colors.purple
    },
    splashField: {
      marginTop: 85,
    }

})

export default Landing
