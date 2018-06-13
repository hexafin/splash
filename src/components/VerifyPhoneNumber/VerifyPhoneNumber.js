import React, {Component} from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Keyboard,
    Alert,
    KeyboardAvoidingView,
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"
import FlatBackButton from "../universal/FlatBackButton"
import Button from "../universal/Button"
import NumericCodeInput from "../universal/NumericCodeInput"
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from "react-native-fcm"

class VerifyPhoneNumber extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.setState(prevState => {
            return {
                ...prevState,
                 confirmResult: (this.props.navigation.state.params) ? this.props.navigation.state.params.confirmResult : null
            }
        })
        this.props.navigation.setParams({ confirmResult: null })
    }

    handleSubmit() {
        Keyboard.dismiss()
        this.props.SmsConfirm(this.state.confirmResult, this.state.code).then(user => {
            this.props.SignUp(user).then(data => {
                console.log(data)
                const {userId, bitcoinData} = data
                this.props.LogIn(userId, bitcoinData).then(() => {
                    this.props.navigation.navigate("SwipeApp")

                    // TODO: FCM -> firebase messaging

                    // FCM.requestPermissions().then(() =>
                    //     FCM.getFCMToken().then(token => {
                    //         api.UpdateAccount(user.uid, {push_token: token})
                    //     })
                    // ).catch(error => {
                    //     console.log("FCM error", error)
                    // })
                    
                }).catch(error => {
                    console.log(error)
                    Alert.alert("An error occurred while logging in. Please try again later")
                })
            }).catch(error => {
                console.log(error)
                Alert.alert("An error occurred while signing up. Please try again later")
            })
        }).catch(error => {
            Alert.alert("An error occurred while confirming SMS. Please try again later")
        })
    }

    render() {

        return (<KeyboardAvoidingView style={styles.container} behavior={"padding"}>

            <View style={styles.body}>

                <Text style={styles.title}>
                    Enter the 6-digit code we{"\n"}
                    just texted you
                </Text>

                <View>
                    <NumericCodeInput size={6} autoFocus={true} callback={(code) => {
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                code: code
                            }
                        })
                    }}/>

                    <View style={styles.resendWrapper}>
                        <Text style={styles.resendText}>Didn{"'"}t get your code?</Text>
                        <Button
                            onPress={() => {
                                this.props.SmsAuthenticate(this.props.phoneNumber, this.props.countryName)
                            }} style={styles.resendButton} title={"Resend"}
                            primary={false} loading={this.props.isSmsAuthenticating} small/>
                    </View>
                </View>

                <Button onPress={this.handleSubmit} style={styles.footerButton} title={"Finish signup"}
                    primary={true}
                    loading={this.props.isSmsConfirming || this.props.isSigningUp}
                    checkmark={this.props.successSigningUp}
                    disabled={this.state.code.length < 6}/>

            </View>

            <FlatBackButton onPress={() => {
                Keyboard.dismiss()
                this.props.navigation.navigate("EnterPhoneNumber")
            }}/>
        </KeyboardAvoidingView>)

    }

}

const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        justifyContent: "space-between",
        position: "relative",
        paddingBottom: 27,
        paddingTop: 80
    },
    body: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 23,
        color: colors.nearBlack,
        marginTop: 20,
        marginBottom: 20,
        textAlign: "center"
    },
    resendWrapper: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 16,
        color: colors.lightGray
    },
    resendButton: {
        width: 90,
        marginLeft: 10,
    }
})

export default VerifyPhoneNumber
