import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {colors} from "../../lib/colors"
import LoadingCircle from "../universal/LoadingCircle"
import Checkmark from "../universal/Checkmark"
import TouchID from 'react-native-touch-id'

const ApproveModal = ({loading, error, success, ApproveTransaction, DismissTransaction, navigation}) => {

  const {transactionId, relativeAmount, domain, relativeCurrency} = navigation.state.params
  const transaction = {transactionId, relativeAmount, domain, relativeCurrency}

  const approve = (transaction) => {
    TouchID.authenticate("Approve Card").then(success => {
        if(success) {
          ApproveTransaction(transaction)
        }
    }).catch(error => {
      console.log('TouchID Error:', error);
    })
  }

  const dismiss = () => {
    navigation.goBack()
    DismissTransaction()
  }

  return (
  <View style={styles.container}>
    <View style={{flexDirection: 'row'}}>
      <View style={[styles.popup, (loading || success) ? {justifyContent: 'center'} : {}]}>

        {!loading && !error && !success &&
        [<View style={styles.content}>
          <Text style={styles.title}>Approve Magic Card</Text>
          <Text style={styles.description}>Create magic card with ${relativeAmount}{'\n'}for {domain} Your bitcoin account{'\n'}will be debited the amount</Text>
        </View>,

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, {borderRightWidth: 1, borderRightColor: colors.purple}]}>
            <Text style={styles.denyText} onPress={() => dismiss()}>Deny</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => approve(transaction)}>
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>]}

        {loading && !error && <LoadingCircle color={colors.purple} size={100} style={{alignSelf: 'center'}}/>}
        {success && !loading && !error && <Checkmark color={colors.purple} size={80} callback={() => dismiss()} style={{alignSelf: 'center'}}/>}

        {error && [<View style={styles.content}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.description}>Oops! something went wrong when processing your transaction</Text>
        </View>,
        <TouchableOpacity style={[styles.footer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.denyText, {alignSelf: 'center'}]} onPress={() => dismiss()}>Dismiss</Text>
        </TouchableOpacity>]}

      </View>
    </View>
  </View>
)};

export default ApproveModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popup: {
    height: 200,
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 15,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: colors.white
  },
  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  description: {
    fontSize: 15,
    marginTop: 20,
    marginHorizontal: 10,
    lineHeight: 20,
  },
  footer: {
    height: 40,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.purple,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: 'stretch'
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  approveText: {
    fontSize: 20,
    color: colors.purple,
    fontWeight: '600'
  },
  denyText: {
    fontSize: 20,
    color: colors.lightGray,
    fontWeight: '600'
  }
});
