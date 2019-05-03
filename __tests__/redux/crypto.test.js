import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
	ActionTypes,
	setActiveCryptoCurrency,
	setActiveCurrency,
	loadBalanceInit,
	loadBalanceSuccess,
	loadBalanceFailure,
	loadExchangeRatesInit,
	loadExchangeRatesSuccess,
	loadExchangeRatesFailure,
	openWalletInit,
	openWalletSuccess,
	openWalletFailure,
	switchWallets,
	resetCrypto,
	Load,
	LoadBalance,
	LoadExchangeRates,
	OpenWallet,
	ToggleNetwork
} from "../../src/redux/crypto/actions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("crypto actions", () => {
	it("setActiveCryptoCurrency format", () => {
		const expectedAction = {
			type: ActionTypes.SET_ACTIVE_CRYPTO_CURRENCY,
			cryptoCurrency: "BTC"
		};
		expect(setActiveCryptoCurrency("BTC")).toEqual(expectedAction);
	});
	it("setActiveCurrency format", () => {
		const expectedAction = {
			type: ActionTypes.SET_ACTIVE_CURRENCY,
			currency: "USD"
		};
		expect(setActiveCurrency("USD")).toEqual(expectedAction);
	});
	it("loadBalanceInit format", () => {
		const expectedAction = {
			type: ActionTypes.LOAD_BALANCE_INIT,
			currency: "BTC"
		};
		expect(loadBalanceInit("BTC")).toEqual(expectedAction);
	});
	it("loadBalanceSuccess format", () => {
		const expectedAction = {
			type: ActionTypes.LOAD_BALANCE_SUCCESS,
			balance: 1000,
			currency: "BTC"
		};
		expect(loadBalanceSuccess(1000, "BTC")).toEqual(expectedAction);
	});
	it("loadBalanceFailure format", () => {
		const expectedAction = {
			type: ActionTypes.LOAD_BALANCE_FAILURE,
			error: "testError"
		};
		expect(loadBalanceFailure("testError")).toEqual(expectedAction);
	});
	it("loadExchangeRatesInit format", () => {
		const expectedAction = {
			type: ActionTypes.LOAD_EXCHANGE_RATES_INIT,
			currency: "ETH"
		};
		expect(loadExchangeRatesInit("ETH")).toEqual(expectedAction);
	});
	it("loadExchangeRatesSuccess format", () => {
		const expectedAction = {
			type: ActionTypes.LOAD_EXCHANGE_RATES_SUCCESS,
			exchangeRates: {
				USD: 1005
			},
			currency: "ETH"
		};
		expect(loadExchangeRatesSuccess({ USD: 1005 }, "ETH")).toEqual(
			expectedAction
		);
	});
	it("loadExchangeRatesFailure format", () => {
		const expectedAction = {
			type: ActionTypes.LOAD_EXCHANGE_RATES_FAILURE,
			error: "testError"
		};
		expect(loadExchangeRatesFailure("testError")).toEqual(expectedAction);
	});
	it("openWalletInit format", () => {
		const expectedAction = {
			type: ActionTypes.OPEN_WALLET_INIT,
			currency: "ETH"
		};
		expect(openWalletInit("ETH")).toEqual(expectedAction);
	});
	it("openWalletSuccess format", () => {
		const expectedAction = {
			type: ActionTypes.OPEN_WALLET_SUCCESS,
			wallet: {
				address: "ethAddress",
				network: "testnet"
			}
		};
		expect(
			openWalletSuccess({
				address: "ethAddress",
				network: "testnet"
			})
		).toEqual(expectedAction);
	});
	it("openWalletFailure format", () => {
		const expectedAction = {
			type: ActionTypes.OPEN_WALLET_FAILURE,
			error: "testError"
		};
		expect(openWalletFailure("testError")).toEqual(expectedAction);
	});
	it("switchWallets format", () => {
		const expectedAction = {
			type: ActionTypes.SWITCH_WALLETS,
			wallet: {
				address: "ethAddress",
				network: "testnet"
			}
		};
		expect(
			switchWallets({
				address: "ethAddress",
				network: "testnet"
			})
		).toEqual(expectedAction);
	});
	it("resetCrypto format", () => {
		const expectedAction = {
			type: ActionTypes.RESET_CRYPTO
		};
		expect(resetCrypto()).toEqual(expectedAction);
	});
});
