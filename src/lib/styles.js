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
	BTC: require("./images/bitcoin-logo.png")
}