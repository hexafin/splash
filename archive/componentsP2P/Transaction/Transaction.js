/* @flow weak */
import React from "react"
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    SectionList,
    ActivityIndicator
} from "react-native"
import {colors} from "../../lib/colors"
import GenericLine from "../universal/GenericLine"
import AddressLine from "../universal/AddressLine"
import {Input} from "../universal/Input"
import BackButton from "../universal/BackButton";
import EmojiButton from "../universal/EmojiButton";
import {Actions} from "react-native-router-flux"
import {defaults} from "../../lib/styles";

//dummy data
// const recent = {
//     type: 'friend',
//     name: 'Maddy Kennedy',
//     username: 'mads',
//     picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
//     emoji: '😍'
// }
// const friend = {
//     type: 'friend',
//     name: 'Maddy Kennedy',
//     username: 'mads',
//     picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
//     emoji: '😍'
// }

const recents = []

const Transaction = ({transactionType = 'send', friends, friendsSearchChange, loading, type = 'internal'}) => {

    //capitalize title
    const pageTitle = transactionType.charAt(0).toUpperCase() + transactionType.slice(1);

    const sections = [
      //  {data: [], title: 'Recents'},
        {data: [], title: 'Friends'},
    ];

    // build and order sections from friend data
    const buildSections = sections.map((section, sectionIndex) => {
        let data = [];
        if (section.title == 'Recents') {
            for (let i = 0; i < recents.length; i++) {
                const friend = recents[i];
                data.push({...friend, type: 'friend', key: (sectionIndex.toString() + i.toString())})
            }
        }
        if (section.title == 'Friends') {
            for (let i = 0; i < friends.length; i++) {
                const friend = friends[i];
                data.push({...friend, type: 'friend', key: (sectionIndex.toString() + i.toString())})
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

            {type == 'internal' && <SectionList style={{padding: 15}}
                         stickySectionHeadersEnabled={false}
                         renderItem={({item}) => <GenericLine {...item} friendCallback={() => Actions.setamount({transactionType: transactionType, to: item})}/>}
                         renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                         sections={buildSections}
            />}

            {type == 'external' && transactionType == 'send' && <SectionList style={{padding: 15}}
                         stickySectionHeadersEnabled={false}
                         renderItem={({item}) => <AddressLine {...item} friendCallback={() => Actions.setamount({transactionType: 'external', to: item})}/>}
                         renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                         sections={buildSections}
            />}
        </ScrollView>
    )

    const renderLoading = (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color={colors.purple}/>
      </View>
    )

    return (
        <View style={styles.container}>
            <BackButton onPress={() => Actions.home()} type="right"/>
            {!loading &&
              <View>
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>{pageTitle} bitcoin</Text>
                </View>
                <View style={styles.search}>
                    <Input input={{onChange: friendsSearchChange}} placeholder={transactionType == 'send' ? 'Search for friend or enter address' : 'Search for name, email, etc.'}/>
                </View>
                {renderSections}
              </View>
            }
            {loading && renderLoading}
        </View>
    )
};

export default Transaction;

const styles = StyleSheet.create({
    container: {
        ...defaults.container,
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
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    sectionHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        paddingTop: 5,
        color: colors.nearBlack,
        fontWeight: '900',
        fontSize: 19,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.white
    },
});