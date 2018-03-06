import React, {Component} from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard
} from "react-native"
import {Input} from "../universal/Input"
import FlatBackButton from "../universal/FlatBackButton"
import Button from "../universal/Button"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"
import { Field, reduxForm } from 'redux-form'
import axios from "axios"
import api from "../../api"
import LoadingCircle from "../universal/LoadingCircle"

const lower = value => value && value.toLowerCase()

class ChooseSplashtag extends Component {

    constructor(props) {
        super(props)
        this.state = {
            splashtagAvailable: null,
            errorCheckingSplashtag: null,
            checkingSplashtag: false
        }
    }

    checkSplashtag(splashtag) {
        this.setState((prevState) => {
            return {
                ...prevState,
                checkingSplashtag: true
            }
        })
        axios.get("https://us-central1-hexa-splash.cloudfunctions.net/splashtagAvailable?splashtag="+splashtag).then(response => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    splashtagAvailable: response.data.available,
                    checkingSplashtag: false,
                    errorCheckingSplashtag: false
                }
            })
        }).catch(error => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    errorCheckingSplashtag: error,
                    checkingSplashtag: false,
                }
            })
        })
    }

    componentWillMount() {
        this.checkSplashtag(this.props.splashtag)
    }

    render() {

        const splashtagCorrectlyFormatted = this.props.splashtag.length >= 3
            && this.props.splashtag.length <= 15
            && !(this.props.splashtag.indexOf(' ') > -1)

        const splashtagWorks = splashtagCorrectlyFormatted && this.state.splashtagAvailable

        return (
            <KeyboardAvoidingView style={styles.container} behavior={"height"}>

                <View style={styles.body}>

                    <Text style={styles.title}>
                        Let{"'"}s get you setup
                    </Text>

                    <Text style={styles.description}>
                        Your splashtag is your unique username, how others find you on Splash
                    </Text>

                    <Field
                        style={[
                            styles.splashtag,
                            this.state.splashtagAvailable ? styles.posField : styles.negField
                        ]}
                        name='splashtag' placeholder='Choose splashtag' component={Input}
                        autoCapitalize="none" autoCorrect={false} spellCheck={false}
                        autoFocus={this.props.splashtag == ""} normalize={lower}
                        onChange={(e) => {
                            this.checkSplashtag(e)
                        }}/>

                    <Button
                        onPress={() => {
                            Keyboard.dismiss()
                            this.props.navigation.navigate("EnterPhoneNumber")
                        }}
                        style={styles.footerButton}
                        title={"Claim splashtag"}
                        primary={true}
                        loading={this.state.checkingSplashtag}
                        disabled={!this.state.splashtagAvailable && this.props.splashtag.length > 0 && !this.state.checkingSplashtag}
                        />

                </View>


                <FlatBackButton onPress={() => {
                    Keyboard.dismiss()
                    this.props.navigation.navigate("Landing")
                }}/>
            </KeyboardAvoidingView>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        justifyContent: "space-between",
        position: "relative",
        paddingBottom: 0,
        paddingTop: 60
    },
    wavesImage: {
        position: "absolute",
        bottom: -50,
        left: 0,
        right: 0,
        width: 400,
        height: 400
    },
    body: {
        flex: 1,
        padding: 20,
        paddingBottom: 0,
        flexDirection: "column",
        justifyContent: "space-around"
    },
    title: {
        fontSize: 30,
        fontWeight: '500',
        color: colors.nearBlack,
        marginBottom: 20,
        textAlign: "center"
    },
    description: {
        fontSize: 20,
        textAlign: "center",
        color: colors.lightGray,
        marginBottom: 20
    },
    posButton: {

    },
    negButton: {
        backgroundColor: colors.red
    },
    posField: {},
    negField: {}
})


export default reduxForm({
   form: 'chooseSplashtag',
   destroyOnUnmount: false,
})(ChooseSplashtag)
