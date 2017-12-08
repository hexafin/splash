import React, {Component} from "react"
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SectionList,
    Modal
} from "react-native"
import {colors} from "../../lib/colors"
import EmojiButton from "../universal/EmojiButton"
import Button from "../universal/Button"
import BackButton from "../universal/BackButton"
import Friend from '../universal/Friend'
import Wallet from '../Wallet'
import {Actions} from "react-native-router-flux"
import {defaults} from "../../lib/styles"


//dummy data to be removed
const request = {
    type: 'request',
    name: 'Maddy Kennedy',
    username: 'mads',
    picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
    usdValue: 50,
    btcValue: 0.045,
    emoji: '😍',
    date: '1:00 11/17'
}
const waiting = {
    type: 'waiting',
    name: 'Maddy Kennedy',
    username: 'mads',
    picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
    usdValue: 50,
    btcValue: 0.045,
    emoji: '😍',
    date: '1:00 11/17'
}
const transaction = {
    type: 'transaction',
    name: 'Maddy Kennedy',
    username: 'mads',
    picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
    usdValue: 50,
    btcValue: 0.045,
    emoji: '😍',
    date: '1:00 11/17'
}

const transactions_dummy = {items: [request, request, request, waiting, waiting, waiting, transaction, transaction, transaction]}

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            notification: null
        }
    }

    componentWillMount() {

    }

    // notification(title, content, actionOnPress=null, actionTitle=null, dismissTitle="Dismiss") {
    //     this.setState({
    //         modalVisible: true,
    //         notification: {
    //             title: title,
    //             content: content,
    //             actionOnPress: actionOnPress,
    //             actionTitle: actionTitle,
    //             dismissTitle: dismissTitle
    //         }
    //     })
    // }
    //
    // closeNotification() {
    //     this.setState({
    //         modalVisible: false,
    //         notification: null
    //     })
    // }
    //
    // renderNotification() {
    //     const notificationFooterAction = (
    //         <TouchableOpacity style={styles.notificationFooterButton} onPress={() => {this.closeNotification()}}>
    //             <Text style={styles.notificationFooterButtonTitle}>{this.state.notification.dismissTitle}</Text>
    //         </TouchableOpacity>
    //     )
    //     return (
    //         <Modal style={{flex:1}} animationType={"slide"} transparent={true} visible={this.state.modalVisible}>
    //             <View style={styles.notificationContainer}>
    //                 <View style={styles.notification}>
    //                     <BackButton onPress={() => {this.closeNotification()}} type="right"/>
    //                     <Text style={styles.notificationTitle}>{this.state.notification.title}</Text>
    //                     <Text style={styles.notificationContent}>{this.state.notification.title}</Text>
    //                     <View style={styles.notificationFooter}>
    //                         {this.state.notification.actionOnPress != null && notificationFooterAction}
    //                     </View>
    //                 </View>
    //             </View>
    //         </Modal>
    //     )
    // }

    render() {

        const {person, balanceBTC, balanceUSD} = this.props

        const transactions = transactions_dummy

        // render blank screen w/o transactions
        const renderBlank = (
            <View key={0} style={{flex: 1, padding: 30}}>
                <Text style={styles.bodyTitle}>
                    Make your first transaction <Text style={styles.bodyTitleEmoji}>☝️</Text>
                </Text>
                <Button title="Deposit bitcoin 💸" onPress={() => Actions.manageFunds()}/>
                <View style={styles.bodySpacer}/>
                <Button title="Ask a friend for bitcoin 🎁" onPress={() => Actions.transaction({transactionType: 'request'})}/>
            </View>
        )

        const sections = [
            {data: [], title: 'Requests', type: 'request'},
            {data: [], title: 'Waiting on', type: 'waiting'},
            {data: [], title: 'History', type: 'transaction'},
        ];

        // build and order sections from transaction data
        // TODO: use real transaction data structure to organize
        // use transactions_dummy instead of transactions to load dummy data
        const buildSections = sections.map((section, sectionIndex) => {
            let data = [];
            for (let i = 0; i < transactions.items.length; i++) {
                const transaction = transactions.items[i];
                if (transaction.type == section.type) {
                    data.push({...transaction, key: (sectionIndex.toString() + i.toString())})
                }
            }
            if (data.length == 0) {
                return {...section, title: ''}
            }
            return {...section, data: data}
        });

        //create sectionList with built data
        const renderSections = (
            <ScrollView key={0} style={{flex: 1}}>

                <View style={styles.homeButtons}>
                    <EmojiButton emoji="💸" onPress={() => Actions.manageFunds()}/>
                    <EmojiButton title="Give bitcoin, get bitcoin" emoji="🎁"/>
                </View>

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

                <View style={styles.header}>
                    <TouchableOpacity style={styles.profile} onPress={() => Actions.profile()}>
                        <Image style={styles.profileImage} source={{uri: person.picture_url}}/>
                        <View style={styles.profileTextWrapper}>
                            <Text style={styles.profileUsername}>@{person.username}</Text>
                            <Text style={styles.profileFullName}>{person.first_name} {person.last_name}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.feedback}>
                        <EmojiButton emoji="👎" onPress={() => Actions.feedback({feedbackType: "negative"})}/>
                        <EmojiButton emoji="👍" onPress={() => Actions.feedback({feedbackType: "positive"})}/>
                    </View>

                </View>

                <TouchableOpacity style={styles.balance} onPress={() => Actions.wallet()}>
                    <Text style={styles.balanceUSD}>$50</Text>
                    <Text style={styles.balanceBTC}>.00333 BTC</Text>
                    <Text style={styles.balanceDescription}>Your bitcoin</Text>
                </TouchableOpacity>

                {/* if there are no transactions render blank*/}
                {transactions.items.length == 0 && renderBlank}
                {/* if there are  transactions render them in sectionList*/}
                {transactions.items.length !== 0 && renderSections}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => Actions.transaction({transactionType: 'request'})} style={styles.footerButton}>
                        <Text style={styles.footerButtonText}>
                            Request
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.footerDivider}/>
                    <TouchableOpacity onPress={() => Actions.transaction({transactionType: 'pay'})} style={styles.footerButton}>
                        <Text style={styles.footerButtonText}>
                            Pay
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
        flexDirection: "column",
        justifyContent: "space-around"
    },
    header: {
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    profile: {
        flexDirection: "row",
        padding: 15,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    profileTextWrapper: {
        flexDirection: "column",
        justifyContent: "center"
    },
    profileUsername: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.nearBlack
    },
    profileFullName: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.gray
    },
    feedback: {
        flexDirection: "row",
        alignItems: "center"
    },
    balance: {
        padding: 20,
        flexDirection: "column",
        justifyContent: "center"
    },
    balanceUSD: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        color: colors.purple
    },
    balanceBTC: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "400",
        color: colors.gray
    },
    balanceDescription: {
        textAlign: "center",
        marginTop: 2,
        fontSize: 15,
        fontWeight: "bold",
        color: colors.nearBlack
    },
    homeButtons: {
        flexDirection: "row",
        justifyContent: "center"
    },
    sectionHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        paddingTop: 5,
        color: colors.nearBlack,
        fontWeight: '900',
        fontSize: 19,
    },
    bodyTitle: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: "bold",
        color: colors.nearBlack,
        paddingBottom: 20
    },
    bodyTitleEmoji: {
        fontSize: 30
    },
    bodySpacer: {
        padding: 10
    },
    footer: {
        flex: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        shadowColor: colors.lightShadow,
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        backgroundColor: colors.white
    },
    footerDivider: {
        width: 1,
        backgroundColor: colors.nearWhite
    },
    footerButton: {
        width: "50%",
        padding: 20,
        justifyContent: 'center',
        backgroundColor: colors.white
    },
    footerButtonText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
        color: colors.purple
    }
})

export default Home
