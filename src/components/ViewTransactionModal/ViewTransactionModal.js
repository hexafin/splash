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
import { cryptoUnits, decimalToUnits, unitsToDecimal } from '../../lib/cryptos'
import api from '../../api'

class ViewTransactionModal extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	thanked: props.transaction.thanked,
	  };
	}

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
			toSplashtag,
			fromSplashtag,
			pending,
			confirmations,
			thanked,
			id,
		} = transaction

		let splashtag = null
		if (direction == 'to' && toSplashtag) splashtag = toSplashtag
		if (direction == 'from' && fromSplashtag) splashtag = fromSplashtag
		const isSplashtag = (direction == 'to' && transaction.toSplashtag) || (direction == 'from' && transaction.fromSplashtag)

	    const letter = (type == 'card') ? domain[0].toUpperCase() : null
	    const domainCapitalized = (type == 'card') ? domain[0].toUpperCase() + domain.slice(1) : null
	    const date = moment.unix(timestamp).format('LLL')
	    const rate = decimalToUnits(exchangeRate, 'USD')
	    const cryptoAmount = (type == 'card') ? amount/cryptoUnits.BTC : unitsToDecimal(amount.subtotal, 'BTC')
	    let oldRelativeAmount = ''
	    if (!!relativeCurrency) oldRelativeAmount =  unitsToDecimal(relativeAmount, 'USD')
	    const currentRelativeAmount = unitsToDecimal(Math.round((amount.subtotal/cryptoUnits.BTC) * rate), 'USD')
	    const infoMessage = (direction == 'from') ? 'Received from' : 'Sent to'
	    console.log(this.state.thanked)
		const pendingCircles = (confirmations) => {
			return (
				<View style={{flexDirection: 'row', paddingBottom: 5, paddingLeft: 10}}>
					<View style={[styles.pendingDarkLine, {width: confirmations*(70/6)}, (confirmations == 6) ? {borderRadius: 3.5} : {}, (confirmations == 0) ? {borderWidth: 0} : {}]} />
					<View style={[styles.pendingLightLine, {width: 70-confirmations*(70/6)}, (confirmations == 0) ? {borderRadius: 3.5} : {}]} />				
				</View>
			)
		}

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
                  <Text style={styles.relativeText}>USD ${currentRelativeAmount}</Text>
                  <Text style={styles.amountText}>{cryptoAmount} BTC</Text>
                </View>
                {type == 'card' && <Text style={styles.subtitle}>Created on</Text>}
                {type == 'blockchain' && <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                	<Text style={styles.subtitle}>{infoMessage}</Text>
                	{isSplashtag && (direction == 'from') && <Button primary={this.state.thanked} disabled={this.state.thanked} title={!this.state.thanked ? 'Say thanks!' : 'Thanked'} small onPress={() => {
                		if (!this.state.thanked) {
	                		api.UpdateTransaction(id, {thanked: !this.state.thanked}).then(() => {
	                			this.setState({thanked: !this.state.thanked})
	                		})
                		}
                	}}/>}
            	</View>}
                <View style={styles.information}>
                    {!isSplashtag && 
                    	<View style={styles.letterCircle}>
	                    	<LetterCircle size={32} letter={letter} currency={currency}/>
                    	</View>}
					{isSplashtag && 
						<View style={styles.letterPreview}>
							<Image
							style={styles.circleSplash} 
							resizeMode="contain" 
							source={require("../../assets/icons/primarySplash.png")}/>
						</View>}
                    {type == 'card' && <Text style={styles.domainText}>{domainCapitalized}</Text>}
                    {type == 'blockchain' && !isSplashtag && <Text style={styles.addressText}>{address}</Text>}
                    {type == 'blockchain' && isSplashtag && 
                    	<View style={styles.column}>
                    		<View style={styles.row}>
	                    		<Text style={styles.splashtagText}>{splashtag}</Text>
								<Image
									style={styles.verified}
									resizeMode="contain"
									source={require("../../assets/icons/checkmarkGreen.png")}/>
							</View>
	                    	<Text style={styles.addressText}>{address}</Text>
                    	</View>}
                </View>
                {pending && <View style={{flexDirection: 'row', alignItems: 'center'}}>
                	<Text style={styles.subtitle}>Confirmations</Text>	
                	{pendingCircles(confirmations)}
                </View>}
                <Text style={styles.subtitle}>{(!!relativeCurrency) ? 'Worth' : 'Date'}</Text>
                <Text style={styles.dateText}>{(!!relativeCurrency) ? '$'+ oldRelativeAmount +' '+relativeCurrency+' on ': ''}{date}</Text>
                <Text style={styles.subtitle}>{(!!relativeCurrency) ? 'Exchange rate used' : 'Current exchange rate'}</Text>
                <Text style={styles.rateText}>1 Bitcoin = USD ${parseFloat(exchangeRate).toFixed(2)}</Text>
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
	column: {
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
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
		width: 20,
		margin: 8,
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
	letterCircle: {
		paddingRight: 10,
	},
	letterPreview: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: colors.primaryLight,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10
	},
	circleSplash: {
		width: 20,
		height: 20,
	},
	splashtagText: {
		color: colors.primaryDarkText,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 3
	},
	verified: {
		width: 18,
		height: 18,
		marginLeft: 5,
	},
	addressText: {
		color: colors.nearBlack,
		fontSize: 12,
		fontWeight: '600'
	},
	rateText: {
		color: colors.nearBlack,
		fontSize: 16,
		paddingBottom: 32
	},
	pendingDarkLine: {
		height: 7,
		borderTopLeftRadius: 3.5,
		borderBottomLeftRadius: 3.5,
		borderColor: colors.primary,
		borderWidth: 0.1,
		backgroundColor: colors.primary,
		marginTop: 2,
		opacity: 1,
	},
	pendingLightLine: {
		height: 7,
		borderTopRightRadius: 3.5,
		borderBottomRightRadius: 3.5,
		opacity: 0.2,
		backgroundColor: colors.primary,
		marginTop: 2,
		marginRight: 3,
	}

});
