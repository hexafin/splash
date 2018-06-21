import React, { Component } from "react"
import {
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	Image,
} from "react-native";
import { colors } from "../../lib/colors"
import { icons, defaults } from "../../lib/styles";
import LoadingCircle from "../universal/LoadingCircle"
import LetterCircle from "../universal/LetterCircle"
import Button from "../universal/Button"
import moment from "moment"
import { cryptoUnits } from '../../lib/cryptos'

class ViewTransactionModal extends Component {

	render() {

		const {
			transaction,
			direction,
			exchangeRate,
			address,
		} = this.props
		const {
			domain,
			currency,
			relativeAmount,
			relativeCurrency,
			amount,
			type,
			timestamp,
		} = transaction
	    const letter = (type == 'card') ? domain[0].toUpperCase() : null
	    const domainCapitalized = (type == 'card') ? domain[0].toUpperCase() + domain.slice(1) : null
	    const date = moment.unix(timestamp).format('LLL')
	    const cryptoAmount = (type == 'card') ? amount/cryptoUnits.BTC : amount.subtotal/cryptoUnits.BTC
	    const rate = (relativeCurrency !== null && typeof relativeCurrency !== 'undefined') ? parseFloat(1.0*relativeAmount/cryptoAmount).toFixed(2) : parseFloat(exchangeRate)
	    const infoMessage = (direction == 'from') ? 'Received from' : 'Sent to'

		return (
			<View style={styles.content}>
				<View style={styles.header}>
				  <View style={styles.titleView}>
	                  <Text style={styles.title}>You {(direction == 'from') ? 'received' : 'sent'}</Text>
					  <Image source={icons.arrow[direction]} style={styles.arrow} resizeMode="cover"/>
				  </View>	                  
                  <TouchableOpacity onPress={this.props.handleClose}>
                    <Image style={styles.closeButton} source={require('../../assets/icons/Xbutton.png')}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.amountBox}>
                  <Text style={styles.relativeText}>USD ${parseFloat(rate*cryptoAmount).toFixed(2)}</Text>
                  <Text style={styles.amountText}>{parseFloat(cryptoAmount).toFixed(5)} BTC</Text>
                </View>
                {type == 'card' && <Text style={styles.subtitle}>Created on</Text>}
                {type == 'blockchain' && <Text style={styles.subtitle}>{infoMessage}</Text>}
                <View style={styles.information}>
                    <LetterCircle size={32} letter={letter} currency={currency}/>
                    {type == 'card' && <Text style={styles.domainText}>{domainCapitalized}</Text>}
                    {type == 'blockchain' && <Text style={styles.addressText}>{address}</Text>}
                </View>
                <Text style={styles.subtitle}>{(!!relativeCurrency) ? 'Worth' : 'Date'}</Text>
                <Text style={styles.dateText}>{(!!relativeCurrency) ? '$'+String(parseFloat(relativeAmount).toFixed(2))+' '+relativeCurrency+' on ': ''}{date}</Text>
                <Text style={styles.subtitle}>{(!!relativeCurrency) ? 'Exchange rate used' : 'Current exchange rate'}</Text>
                <Text style={styles.rateText}>1 Bitcoin = USD ${rate}</Text>
                <Button primary={true} title={'Got it'} onPress={this.props.handleClose} />
			</View>    							
		);
	}
}

export default ViewTransactionModal;

const styles = StyleSheet.create({
	content: {
		flex: 1,
		padding: 30,
	},
	header: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    justifyContent: 'space-between',
	    paddingBottom: 17,
	},
	titleView: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	title: {
	    fontSize: 20,
	    fontWeight: "600",
	    color: colors.nearBlack,
	},
	closeButton: {
		height: 20,
		width: 20
	},
	arrow: {
		width: 48,
		height: 24,
		marginTop: 9,
		marginLeft: 5,
		overflow: "visible"
	},
	amountBox: {
	    height: 83,
	    justifyContent: 'center',
	    alignItems: 'center',
	    alignSelf: 'stretch',
	    borderRadius: 8,
	    backgroundColor: '#6364F1',
	    marginBottom: 30,
	    marginHorizontal: 11,
	},
	information: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 12
	},
	subtitle: {
		fontSize: 16,
		color: '#B1B1B1',
		paddingBottom: 5,
	},
	relativeText: {
		fontSize: 28,
		color: colors.white,
		fontWeight: '600'
	},
	amountText: {
		fontSize: 18,
		opacity: 0.77,
		color: colors.white,
		fontWeight: '600'
	},
	domainText: {
		color: colors.nearBlack,
		fontSize: 15,
		paddingLeft: 10
	},
	dateText: {
		color: colors.nearBlack,
		fontSize: 16,
		paddingBottom: 15
	},
	addressText: {
		color: colors.nearBlack,
		fontSize: 12,
		paddingLeft: 5,
		fontWeight: '600'
	},
	rateText: {
		color: colors.nearBlack,
		fontSize: 16,
		paddingBottom: 32
	}


});