const initialState = {
	currency: null,
	amount: null,
	splashtag: null,
	address: null,
	userId: null,
	capturedQr: false,
}

export default function payFlow(state = initialState, action) {
	switch (action.type) {
		case "ENTER_AMOUNT":
			return {
				...initialState,
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
		case "CAPTURE_QR":
			return {
				...state,
				capturedQr: true,
				address: action.address,
			}
			
		case "RESET":
			return initialState

		default:
			return state
	}
}

export function enterAmount(currency, amount) {
	return {type: "ENTER_AMOUNT", currency, amount}
}

export function captureQr(address) {
	return {type: "CAPTURE_QR", address}
}

export function sendTo(address, splashtag=null, userId=null) {
	return {type: "SEND_TO", address, splashtag, userId}
}