import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import {Actions} from "react-native-router-flux"

const Coinbase = ({LoadApp, LinkCoinbase}) => (
  <View style={styles.container}>
    <Text style={{fontSize: 44}}>💰</Text>
    <Text style={styles.headerText}>Fund Your Account</Text>
    <Text style={[styles.paragraphText, {paddingTop: 45}]}>Easily add bitcoin to your account</Text>
    <Text style={styles.paragraphText}>using Coinbase.</Text>
    <View style={styles.buttons}>
      <TouchableOpacity style={styles.button} onPress={() => LinkCoinbase()}>
        <Text style={[styles.buttonText, {color: colors.purple}]}>Connect with Coinbase</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => LoadApp()}>
        <Text style={[styles.buttonText, {color: colors.lightGrey}]}>Skip</Text>
      </TouchableOpacity>
    </View>

  </View>
);


export default Coinbase

const styles = StyleSheet.create({
  container: {
    ...defaults.container,
    paddingTop: 75,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    paddingTop: 5,
    lineHeight: 33,
    color: colors.nearBlack
  },
  paragraphText: {
    fontSize: 19,
    fontWeight: "400",
    color: colors.lightGrey,
    lineHeight: 26,
  },
  buttons: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    flexDirection: "column"
  },
  button: {
    shadowColor: colors.lightShadow,
		shadowOffset: defaults.shadowOffset,
		shadowOpacity: defaults.shadowOpacity,
		shadowRadius: defaults.shadowRadius,
		borderRadius: 5,
		padding: 20,
    marginTop: 30,
		justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  }
});
