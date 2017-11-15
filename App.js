/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';

import firebase from 'react-native-firebase';

let firestore = firebase.firestore();

import { NewPerson } from './src/firestore/Person.js';

import { Pay, Request } from './src/firestore/Transaction.js';

export default class App extends Component<{}> {
    render() {

        var picture_url = "http://graph.facebook.com/1424111897702966/picture?type=square";


        return (
            <View style={styles.container}>

                <Text style={{ fontSize: 18, padding: 20 }}>
                    {"Sample Firestore Operation"}
                </Text>

                <Button

                    onPress={() => {
                        NewPerson("Bryce", "Bjork", "brycedbjork@gmail.com", "9785012350", null, picture_url,
                            "338 College Road", "Concord", "MA",
                            "01742", "USA")
                    }}
                    title="Create New Person and Personal Wallet"
                />

                <Button

                    onPress={() => {
                        alert(1)
                    }}
                    title="Create New Transaction"
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
