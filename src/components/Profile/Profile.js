/* @flow weak */
import React from "react"
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import Button from "../universal/Button"
import GenericLine from "../universal/GenericLine"
import {Input, MultiInput, MultiInputBlock} from "../universal/Input"
import BackButton from "../universal/BackButton"
import EmojiButton from "../universal/EmojiButton"
import {Actions} from "react-native-router-flux"
import {reduxForm, Field} from "redux-form";

const Profile = ({person, LogOut}) => {

    const pictureUrl = "https://graph.facebook.com/"+person.facebook_id+"/picture?type=large"

    return (
        <View style={styles.container} behavior="height">
            <BackButton onPress={() => Actions.pop()} type="right"/>
            <View style={styles.header}>
                <Image style={styles.profileImage} source={{uri: pictureUrl}}/>
                <Text style={styles.usernameTitle}>@{person.username}</Text>
            </View>

            <ScrollView>

                <View style={styles.body}>

                    <Text style={styles.sectionHeader}>Splashtag</Text>

                    <View style={styles.usernameWrapper}>
                        <Text style={styles.atSign}>@</Text>
                        <Field style={styles.usernameField} name='username' placeholder='Choose username' component={Input}
                               autoCapitalize="none" autoCorrect={false} spellCheck={false} autoFocus={false}/>
                    </View>

                    <Text style={styles.sectionHeader}>Details</Text>

                    <MultiInputBlock inputs={[
                        {
                            name: "first_name",
                            placeholder: "First name"
                        },
                        {
                            name: "last_name",
                            placeholder: "Last name"
                        },
                        {
                            name: "email",
                            placeholder: "Email"
                        }
                    ]}/>

                    <Text style={styles.sectionHeader}>Currency</Text>

                    <Field style={styles.currencyField} name='default_currency' placeholder='Currency' component={Input}
                           autoCapitalize="none" autoCorrect={false} spellCheck={false} autoFocus={false}/>

                    <Text style={styles.sectionHeader}>Feedback</Text>

                    <View style={styles.feedbackButtons}>

                        <EmojiButton emoji="👎" onPress={() => Actions.feedback({feedbackType: "negative"})}/>

                        <EmojiButton emoji="👍" onPress={() => Actions.feedback({feedbackType: "positive"})}/>

                    </View>

                </View>

                <Button title="Logout" onPress={() => LogOut()}/>

                <Text style={styles.footerLegal}>
                    Hexa Financial Group Inc.
                </Text>

            </ScrollView>

        </View>
    )

}

const styles = StyleSheet.create({
    container: defaults.container,
    header: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20,
        marginTop: 20,
        paddingBottom: 20,
        alignItems: "center"
    },
    usernameWrapper: {
        flexDirection: "row",
        flex: 1,
    },
    atSign: {
        fontSize: 28,
        color: colors.gray,
        paddingTop: 14,
        paddingRight: 10
    },
    usernameField: {
        width: "90%"
    },
    currencyField: {
        flex: 1
    },
    sectionHeader: {
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: colors.nearBlack,
        fontWeight: '900',
        fontSize: 19,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    usernameTitle: {
        fontWeight: "700",
        fontSize: 22,
        color: colors.nearBlack,
        textAlign: "center"
    },
    body: {
        padding: 30,
        paddingTop: 0,
        flexDirection: "column",
        justifyContent: "space-between"
    },
    bodySpacer: {
        height: 50
    },
    feedbackButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    footer: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: "40%"
    },
    footerLegal: {
        color: colors.gray,
        padding: 40,
        textAlign: "center"
    }
})


export default reduxForm({
    form: 'profile',
    destroyOnUnmount: false,
})(Profile)
