import {colors} from "./colors"

import {ifIphoneX} from "react-native-iphone-x-helper"

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
		flex: 1,
		...ifIphoneX({
			paddingTop: 20,
			paddingBottom: 20
		})
	}
}