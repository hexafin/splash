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
import { Linking, AppState } from 'react-native'


class Landing extends Component {
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    Linking.getInitialURL().then(url => console.log('initial', url));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (currentAppState) => {
    Linking.getInitialURL().then(url => this.handleDeepLink({ url }));
  };

  handleDeepLink = (event) => {
	  const parts = (event.url).split('/')
    console.log(parts);
  };
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
                    <View style={styles.slogan}>
                        <Text style={styles.sloganText}>
                            Splash is your wallet
                        </Text>
                        <Text style={styles.sloganSubText}>
                            Make it personal with a splashtag
                        </Text>
                    </View>
                </View>

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
        marginBottom: 20,
        textAlign: "center"
    },
    sloganSubText: {
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
    }
})

export default Landing
