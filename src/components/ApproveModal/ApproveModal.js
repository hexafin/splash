import React from "react"
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Image } from "react-native"
import { colors } from "../../lib/colors"
import LoadingCircle from "../universal/LoadingCircle"
import LetterCircle from "../universal/LetterCircle"
import Checkmark from "../universal/Checkmark"
import TouchID from "react-native-touch-id"
import Button from "../universal/Button"

const ApproveModal = ({
	loading,
	error,
	success,
	ApproveTransaction,
	DismissTransaction,
	navigation
}) => {
	const {
		transactionId,
		relativeAmount,
		domain,
		relativeCurrency,
    exchangeRate
	} = navigation.state.params
	const transaction = {
		transactionId,
		relativeAmount,
		domain,
		relativeCurrency
	}

	const approve = transaction => {
		TouchID.authenticate("Approve Card")
			.then(success => {
				if (success) {
					ApproveTransaction(transaction)
				}
			})
			.catch(error => {
				console.log("TouchID Error:", error)
			})
	}

	const dismiss = () => {
		navigation.goBack()
		DismissTransaction()
	}

  const letter = domain[0].toUpperCase()
  const rate = parseFloat(exchangeRate).toFixed(2)
  const btcAmount = (1.0*relativeAmount/parseFloat(exchangeRate)).toFixed(5)

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: "row" }}>
				<View
					style={[
						styles.popup,
					]}>
					{ !error &&
							<View style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.title}>Transaction request</Text>
                  <TouchableOpacity onPress={() => dismiss()}>
                    <Image style={{height: 14, width: 14}} source={require('../../assets/icons/Xbutton.png')}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.information}>
                  <Text style={styles.exchangeText}>1 BTC = ${rate} {relativeCurrency}</Text>
                  <View style={styles.amountBox}>
                    <Text style={{fontSize: 24, color: colors.white, fontWeight: '600'}}>{relativeCurrency} ${relativeAmount}</Text>
                    <Text style={{fontSize: 15, color: colors.white, fontWeight: '600'}}>{btcAmount} BTC</Text>
                  </View>
                  <View style={styles.domainInfo}>
                    <Text style={{paddingRight: 10, fontSize: 12, fontWeight: '800', color: colors.nearBlack}}>on</Text>
                    <LetterCircle size={32} letter={letter}/>
                    <View style={styles.domain}>
                      <Text>{domain}</Text>
                      <Text>via Splash Chrome extension</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.footer}>
                  <Text style={styles.description}>We will load {relativeCurrency} ${relativeAmount} onto a temporary {'\n'} “magic” credit card you can use in your browser.</Text>
                  <Button onPress={() => approve(transaction)} style={styles.button} loading={loading && !success} checkmark={success && !loading}
										checkmarkCallback={() => dismiss()} disabled={error || loading} title={"Approve Transaction"} primary={true}/>
                  <View style={{flexDirection: 'row', paddingTop: 10, alignSelf: 'center', alignItems: 'center'}}>
                    <Image style={{height: 13, width: 10}} source={require('../../assets/icons/lockIcon.png')}/>
                    <Text style={{paddingLeft: 10, backgroundColor: 'rgba(0,0,0,0)', color: colors.lightGray, fontSize: 15, fontWeight: '600'}}>Payment secured by Splash</Text>
                  </View>
                </View>
							</View>
            }

					{error &&
						<View style={styles.content}>
						<View style={styles.header}>
							<Text style={styles.title}>Transaction request</Text>
							<TouchableOpacity onPress={() => dismiss()}>
								<Image style={{height: 14, width: 14}} source={require('../../assets/icons/Xbutton.png')}/>
							</TouchableOpacity>
						</View>
						<Text style={{justifyContent: 'center', alignItems: 'center'}}>
							Oops! something went wrong when processing your
							transaction
						</Text>
						</View>}
				</View>
			</View>
		</View>
	)
}

export default ApproveModal

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0)",
    justifyContent: 'flex-end'
	},
  popup: {
    flex: 1,
    flexDirection: "column",
    height: 474,
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: colors.white
  },
  content: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 72,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    alignSelf: "stretch",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.nearBlack,
  },
  information: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  amountBox: {
    height: 83,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 15,
    backgroundColor: colors.purple,
  },
  domainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
  },
  domain: {
    paddingLeft: 10,
    flexDirection: 'column'
  },
  description: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.lightGray,
    fontWeight: '600',
    paddingBottom: 20,
  },
})
