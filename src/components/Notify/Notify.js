import React, {Component} from "react"
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Modal,
		Animated
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"
import BackButton from "../universal/BackButton"
import {Actions} from "react-native-router-flux"


class Notify extends Component {
	constructor(props) {
    super(props)

    this.state = {
      opacity: new Animated.Value(0),
    }
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      duration: 100,
      toValue: 1,
    }).start();
  }

  closeModal = () => {
    Animated.timing(this.state.opacity, {
      duration: 100,
      toValue: 0,
    }).start(Actions.pop);
  }

	render() {

		const dismissButtonView = (
			<View style={styles.footer}>
				<TouchableOpacity style={styles.footerButton} onPress={() => {this.closeModal()}}>
					<Text style={styles.footerButtonText}>Dismiss</Text>
				</TouchableOpacity>
			</View>
		)

		// const customButtonsView = (
		// 	<View style={styles.footer}>
		// 		<TouchableOpacity style={styles.footerButton} onPress={()=>{this.props.leftButtonAction}}>
		// 			<Text style={styles.footerButtonText}>{this.props.leftButtonText}</Text>
		// 		</TouchableOpacity>
		// 		<TouchableOpacity style={styles.footerButton} onPress={()=>{this.props.rightButtonAction}}>
		// 			<Text style={styles.footerButtonText}>{this.props.rightButtonText}</Text>
		// 		</TouchableOpacity>
		// 	</View>
		// )

    return (
        <Animated.View style={[styles.transparent, { opacity: this.state.opacity }]}>
					<BackButton onPress={() => {this.closeModal()}} type="right"/>
					<View style={styles.card}>
						<View style={styles.emoji}>
							<Text style={styles.emojiText}>{this.props.emoji}</Text>
						</View>
						<View style={styles.title}>
							<Text style={styles.titleText}>{this.props.title}</Text>
						</View>
						<View style={styles.body}>
							<Text style={styles.bodyText}>{this.props.text}</Text>
						</View>
						{dismissButtonView}
					</View>
        </Animated.View>
    )
	}



};

export default Notify;

const styles = StyleSheet.create({
    transparent: {
			backgroundColor: 'rgba(255,255,255,0.8)',
	    position: 'absolute',
	    top: 0,
	    bottom: 0,
	    left: 0,
	    right: 0,
	    justifyContent: 'center',
	    alignItems: 'center',
    },
    card: {
      ...defaults.shadow,
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      paddingTop: 15,
			marginLeft: 25,
			marginRight: 25
    },
		emoji: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			padding: 10
		},
    emojiText: {
			fontSize: 48,
			textAlign: "center",
		},
		title: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			padding: 10,
			paddingRight: 20,
			paddingLeft: 20,
		},
		titleText: {
			fontSize: 28,
			color: colors.purple,
			fontWeight: "600",
			textAlign: "center",
		},
		body: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			padding: 10,
			paddingRight: 20,
			paddingLeft: 20,
			paddingBottom: 30
		},
		bodyText: {
			fontSize: 18,
			color: colors.nearBlack,
			textAlign: "center",
		},
		footer: {
			backgroundColor: colors.purple,
			flexDirection: "row",
			justifyContent: "space-around",
			borderBottomLeftRadius: 10,
			borderBottomRightRadius: 10
		},
		footerButton: {
			padding: 15,
			flex: 1,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center"
		},
		footerButtonText: {
			fontSize: 20,
			color: colors.white,
			fontWeight: "800",
		}
});
