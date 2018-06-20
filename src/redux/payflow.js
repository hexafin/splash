const initialState = {
	currency: null,
	amount: null,
	splashtag: null,
	address: null,
	userId: null,
	scannedQr: false,
}

export default function payFlow(state = initialState, action) {
	switch (action.type) {
		case "ENTER_AMOUNT":
			return {
				...state,
				currency: action.currency,
				amount: action.amount,
			}
		case "SEND_TO":
			return {
				...state,
				splashtag: action.splashtag,
				address: action.address,
				userId: action.userId,
			}
		case "RESET":
			return initialState
	}
}

export function enterAmount(currency, amount) {
	return {type: "ENTER_AMOUNT", currency, amount}
}

export function sendTo(address, splashtag=null, userId=null) {
	return {type: "ENTER_AMOUNT", address, splashtag, userId}
}