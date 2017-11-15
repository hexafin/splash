/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import firebase from 'react-native-firebase';
let firestore = firebase.firestore();

import {NewPerson} from './src/firestore/Person.js';

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Button
            onPress={() => {
                NewPerson()
            }}
            title="Create New Person"
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
