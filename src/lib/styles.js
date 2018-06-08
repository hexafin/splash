import {colors} from "./colors"

import {isIphoneX} from "react-native-iphone-x-helper"

export const defaults = {
	shadowOffset: {
		width: 0,
		height: 10,
	},
	shadowOpacity: 0.1,
	shadowRadius: 24,
	shadow: {
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.1,
		shadowRadius: 24,
	},
	container: {
        backgroundColor: colors.white,
		flex: 1
	},
	footer: {

	}
}

if (isIphoneX()) {
	defaults.container.paddingBottom = 20;
    defaults.container.paddingTop = 20;
    defaults.footer.paddingBottom = 20;
}

export const icons = {
	BTC: require("../assets/images/bitcoin-logo.png"),
	btcLetter: require("../assets/icons/bitcoin-letter-icon.png"),
	whiteSplash: require("../assets/icons/whiteSplash.png"),
	primarySplash: require("../assets/icons/primarySplash.png"),
	qrIcon: require("../assets/icons/qrIcon.png"),
	arrow: {
		to: require("../assets/icons/primaryRightArrow.png"),
		from: require("../assets/icons/greenLeftArrow.png")
	},
	refresh: require("../assets/icons/refreshCircle.png"),
	crossWhite: require("../assets/icons/crossWhite.png"),
	crossGray: require("../assets/icons/crossGray.png"),
}
