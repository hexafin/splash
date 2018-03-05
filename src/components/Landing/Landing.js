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
import { Linking } from 'react-native'
import { Field } from 'redux-form'
import {Input} from "../universal/Input"


class Landing extends Component {

  componentDidMount() {
    Linking.addEventListener('url', this.handleDeepLink);
    Linking.getInitialURL().then(url => this.handleDeepLink({url}));
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleDeepLink);
  }

  handleDeepLink = (event) => {
    if (event.url) {
      const parts = (event.url).split('/')
      const splashtag = parts[6]
      const phoneNumber = (parts[7]).split('&')[0]
      console.log(event.url);
      if (!(splashtag == this.props.splashtagOnHold && phoneNumber == this.props.phoneNumber)) {
        this.props.getDeepLinkedSplashtag(splashtag, phoneNumber)
      }
    }
  };
    render() {

        return (
            <View style={styles.container}>

                <Image style={styles.wavesImage}
                    source={require("../../assets/images/waves.png")}/>

                {!this.props.splashtagOnHold && <View style={styles.header}>
                    <View style={styles.centerLogoWrapper}>
                        <Image source={icons.splash}
                            style={styles.logo}/>
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
                        <Image source={icons.splash}
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
                    </View>
                    <Input
                        input={{style: styles.splashField}}
                        name='splashtag' placeholder={this.props.splashtagOnHold}
                        autoCapitalize="none" spellCheck={false}
                        autoFocus={false}
                        />
                </View>}


                <View style={styles.floating}></View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton}
                        onPress={() => {this.props.navigation.navigate("ChooseSplashtag")}}>
                        <Text style={styles.footerButtonText}>
                            Claim your splashtag
                        </Text>
                    </TouchableOpacity>
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
