
import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView
} from "react-native"
import {colors} from "../../lib/colors"
import Button from "../universal/Button"
import BackButton from "../universal/BackButton";
import {Actions} from "react-native-router-flux"
import { Input } from '../universal/Input'
import { Field, reduxForm } from 'redux-form'


const ChooseUsername = ({usernameError, CheckUsername}) => {
    return (
        <KeyboardAvoidingView behavior="height" style={styles.container}>
            <BackButton onPress={() => Actions.pop()} />
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🎅</Text>
                <Text style={styles.headerText}>Choose your username</Text>
                <Text style={styles.headerText}>- it{"'"}s yours, forever.</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.usernameWrapper}>
                    <Text style={[styles.atSign, usernameError && {color: colors.red}]}>@</Text>
                    <Field style={styles.usernameField} name='username' placeholder='Choose username' component={Input}
                           autoCapitalize="none" autoCorrect={false} spellCheck={false} autoFocus={true}/>
                </View>
                {!usernameError && <Text style={styles.bodyText}>
                    Your username will be the way people can find you in the app and send money to you.
                </Text>}
                {usernameError && <Text style={styles.errorText}>
                    {usernameError}
                </Text>}
            </View>
            <Button tyle={{flex: 0}} title="Set username" onPress={CheckUsername} />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: colors.white
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
    usernameWrapper: {
        flexDirection: "row",
        justifyContent: "center"
    },
    atSign: {
        fontSize: 28,
        color: colors.gray,
        paddingTop: 14,
        paddingRight: 10
    },
    usernameField: {
        flex: 1
    },
    body: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    bodyText: {
        flex: 1,
        marginTop: 15,
        color: colors.gray,
        textAlign: "center",
        fontSize: 20,
        paddingLeft: 20,
        paddingRight: 20,
        fontWeight: "500",
        backgroundColor: 'rgba(0,0,0,0)'
    },
    errorText: {
      flex: 1,
      marginTop: 15,
      color: colors.red,
      textAlign: "center",
      fontSize: 20,
      paddingLeft: 20,
      paddingRight: 20,
      fontWeight: "500",
      backgroundColor: 'rgba(0,0,0,0)'
    }
})

export default reduxForm({
   form: 'username',
   destroyOnUnmount: false,
})(ChooseUsername)
