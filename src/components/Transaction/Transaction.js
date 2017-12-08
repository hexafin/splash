/* @flow weak */
import React from "react"
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import Button from "../universal/Button"
import Friend from "../universal/Friend"
import {Input} from "../universal/Input"
import BackButton from "../universal/BackButton";
import EmojiButton from "../universal/EmojiButton";
import {Actions} from "react-native-router-flux"

//dummy data
const recent = {
    type: 'friend',
    name: 'Maddy Kennedy',
    username: 'mads',
    picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
    emoji: '😍'
}
const friend = {
    type: 'friend',
    name: 'Maddy Kennedy',
    username: 'mads',
    picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
    emoji: '😍'
}

const friends = [friend, friend, friend]
const recents = [recent, recent, recent]

const Transaction = ({transactionType = 'pay'}) => {

    //capitalize title
    const pageTitle = transactionType.charAt(0).toUpperCase() + transactionType.slice(1);

    const sections = [
        {data: [], title: 'Recents'},
        {data: [], title: 'Friends'},
    ];

    // build and order sections from friend data
    // TODO: use real friend data structure to organize
    const buildSections = sections.map((section, sectionIndex) => {
        let data = [];
        if (section.title == 'Recents') {
            for (let i = 0; i < recents.length; i++) {
                const friend = recents[i];
                data.push({...friend, key: (sectionIndex.toString() + i.toString())})
            }
        }
        if (section.title == 'Friends') {
            for (let i = 0; i < friends.length; i++) {
                const friend = friends[i];
                data.push({...friend, key: (sectionIndex.toString() + i.toString())})
            }
        }
        if (data.length == 0) {
            return {...section, title: ''}
        }
        return {...section, data: data}
    });

    //create sectionList with built data
    const renderSections = (
        <ScrollView key={0} style={styles.body}>

            {/*<View style={styles.searchButtons}>*/}
                {/*<EmojiButton title="Send to bitcoin address" emoji="🤷‍♀️" />*/}
            {/*</View>*/}

            <SectionList style={{paddingHorizontal: 15, marginTop: 15}}
                         stickySectionHeadersEnabled={false}
                         renderItem={({item}) => <Friend {...item}/>}
                         renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                         sections={buildSections}
            />
        </ScrollView>
    )

    return (
        <View style={styles.container}>
            <BackButton onPress={() => Actions.pop()} type="right"/>
            <View style={styles.header}>
                <Text style={styles.pageTitle}>{pageTitle} bitcoin</Text>
            </View>
            <View style={styles.search}>
                <Input input={{}} placeholder={'Search for username, email, etc.'}/>
            </View>
            {renderSections}
        </View>
    )
};

export default Transaction;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 40
    },
    pageTitle: {
        color: colors.nearBlack,
        fontSize: 26,
        fontWeight: '900',
    },
    search: {
        padding: 15
    },
    searchButtons: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    body: {
        paddingTop: 0
    },
    sectionHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        paddingTop: 5,
        color: colors.nearBlack,
        fontWeight: '900',
        fontSize: 19,
    },
});
