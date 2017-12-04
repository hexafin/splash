// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import Button from "../universal/Button"
import BackButton from "../universal/BackButton"

import {Actions} from "react-native-router-flux"
import { MultiInputBlock } from '../universal/Input'
import { reduxForm } from 'redux-form'

const ChoosePassword = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={() => Actions.pop()}/>
                <Text style={styles.headerEmoji}>👩‍🎨</Text>
                <Text style={styles.headerText}>Choose password</Text>
            </View>
            <View style={styles.body}>
                 <MultiInputBlock 
                    inputs={[
                        {
                            name: 'password',
                            placeholder: 'Choose password'
                        },
                        {
                            name: 'password-confirm',
                            placeholder: 'Confirm password'
                        }

                    ]}
                    secureTextEntry
                />
                <Text style={styles.bodyText}>
                    Choose something secure 🔒
                </Text>
            </View>
            <Button style={{flex: 0}} title="All done" onPress={() => Actions.addFunds()}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: colors.white,
        padding: 20,
        paddingTop: 30,
        paddingBottom: 60
    },
    header: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    headerEmoji: {
        fontSize: 40,
        flexDirection: "row",
        textAlign: "center",
        padding: 5
    },
    headerText: {
        flexDirection: "row",
        fontSize: 25,
        textAlign: "center",
        paddingTop: 5,
        fontWeight: "600",
        color: colors.nearBlack
    },
    body: {
        paddingTop: 50,
        flex: 2,
        flexDirection: "column",
        justifyContent: "center"
    },
    bodyText: {
        marginTop: 20,
        color: colors.gray,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "400",
        backgroundColor: "transparent",
        lineHeight: 25
    }
})

export default reduxForm({
    form: 'onboarding',
    destroyOnUnmount: false,
})(ChoosePassword) 