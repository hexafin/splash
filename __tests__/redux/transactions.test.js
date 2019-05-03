import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
	DISMISS_TRANSACTION,
	APPROVE_TRANSACTION_INIT,
	APPROVE_TRANSACTION_SUCCESS,
	APPROVE_TRANSACTION_FAILURE,
	SEND_TRANSACTION_INIT,
	SEND_TRANSACTION_SUCCESS,
	SEND_TRANSACTION_FAILURE,
	RESET_TRANSACTIONS,
	LOAD_TRANSACTIONS_INIT,
	LOAD_TRANSACTIONS_SUCCESS,
	LOAD_TRANSACTIONS_FAILURE,
	CAPTURE_QR,
	RESET_QR,
	dismissTransaction,
	approveTransactionInit,
	successApprovingTransaction,
	approveTransactionFailure,
	sendTransactionInit,
	sendTransactionSuccess,
	sendTransactionFailure,
	captureQr,
	resetTransactions,
	resetQr
} from "../../src/redux/transactions/actions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("transactions actions", () => {
	it("dismissTransaction format", () => {
		const expectedAction = {
			type: DISMISS_TRANSACTION
		};
		expect(dismissTransaction()).toEqual(expectedAction);
	});
	it("approveTransactionInit format", () => {
		const expectedAction = {
			type: APPROVE_TRANSACTION_INIT,
			transaction: {}
		};
		expect(approveTransactionInit({})).toEqual(expectedAction);
	});
	it("approveTransactionSuccess format", () => {
		const expectedAction = {
			type: APPROVE_TRANSACTION_SUCCESS
		};
		expect(successApprovingTransaction()).toEqual(expectedAction);
	});
	it("approveTransactionFailure format", () => {
		const expectedAction = {
			type: APPROVE_TRANSACTION_FAILURE,
			error: "testError"
		};
		expect(approveTransactionFailure("testError")).toEqual(expectedAction);
	});
	it("sendTransactionInit format", () => {
		const expectedAction = {
			type: SEND_TRANSACTION_INIT
		};
		expect(sendTransactionInit()).toEqual(expectedAction);
	});
	it("sendTransactionSuccess format", () => {
		const expectedAction = {
			type: SEND_TRANSACTION_SUCCESS
		};
		expect(sendTransactionSuccess()).toEqual(expectedAction);
	});
	it("sendTransactionFailure format", () => {
		const expectedAction = {
			type: SEND_TRANSACTION_FAILURE,
			error: "testError"
		};
		expect(sendTransactionFailure("testError")).toEqual(expectedAction);
	});
	it("captureQr format", () => {
		const expectedAction = {
			type: CAPTURE_QR,
			address: "testAddress"
		};
		expect(captureQr("testAddress")).toEqual(expectedAction);
	});
	it("resetQr format", () => {
		const expectedAction = {
			type: RESET_QR
		};
		expect(resetQr()).toEqual(expectedAction);
	});
	it("resetTransactions format", () => {
		const expectedAction = {
			type: RESET_TRANSACTIONS
		};
		expect(resetTransactions()).toEqual(expectedAction);
	});
});
