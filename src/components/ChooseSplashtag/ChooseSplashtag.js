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
import Checkmark from "../universal/Checkmark"
import debounce from 'lodash/debounce';

const lower = value => value && value.toLowerCase()

class ChooseSplashtag extends Component {

    constructor(props) {
        super(props)
        this.state = {
            splashtagAvailable: {available: null, availableWaitlist: null, availableUser: null, validSplashtag: null},
            errorCheckingSplashtag: null,
            checkingSplashtag: false
        }
        this.checkSplashtag = this.checkSplashtag.bind(this);
        this.debouncedOnChange = debounce(this.checkSplashtag, 100);
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
                    splashtagAvailable: response.data,
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

        const splashtagCorrectlyFormatted = /^[a-z0-9_-]{3,15}$/.test(this.props.splashtag)

        const splashtagWorks = splashtagCorrectlyFormatted && this.state.splashtagAvailable.available

        let buttonTitle = "Choose your splashtag"
        if (this.props.splashtag.length < 3 && this.props.splashtag.length != 0) {
          buttonTitle = "Too short"
        }
        else if (this.props.splashtag.length > 15) {
          buttonTitle = "Too Long"
        }
        else if (this.props.splashtag.length != 0){
          if (splashtagWorks) {
              buttonTitle = "Claim splashtag"
          }
          else if (!this.state.splashtagAvailable.validSplashtag) {
            buttonTitle = "Only use letters and numbers"
          }
          else if (!this.state.splashtagAvailable.available) {
              buttonTitle = "Splashtag already taken"
          }
          else if(this.state.errorCheckingSplashtag) {
              buttonTitle = "Ugh! There was an error 🤭"
          }
        }

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
                        name='splashtag' placeholder='Choose splashtag' component={Input}
                        autoCapitalize="none" autoCorrect={false} spellCheck={false}
                        autoFocus={true} normalize={lower}
                        checkmark={this.state.splashtagAvailable.available && this.props.splashtag.length > 0 && !this.state.checkingSplashtag}
                        onChange={this.debouncedOnChange}
                        />

                    <Button
                        onPress={() => {
                            Keyboard.dismiss()
                            if (splashtagWorks) {
                              this.props.navigation.navigate("EnterPhoneNumber")
                            }
                        }}
                        style={[
                            styles.footerButton,
                            this.state.splashtagAvailable.available ? styles.posButton : styles.negButton
                        ]}
                        title={buttonTitle}
                        primary={true}
                        loading={this.state.checkingSplashtag}
                        disabled={!this.state.splashtagAvailable.available || this.props.splashtag.length == 0 || this.state.checkingSplashtag}
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
        backgroundColor: colors.lightGray
    },
})


export default reduxForm({
   form: 'chooseSplashtag',
   destroyOnUnmount: false,
})(ChooseSplashtag)
