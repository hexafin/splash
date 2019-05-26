import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
	SMS_AUTH_INIT,
	SMS_AUTH_SUCCESS,
	SMS_AUTH_FAILURE,
	SMS_CONFIRM_INIT,
	SMS_CONFIRM_SUCCESS,
	SMS_CONFIRM_FAILURE,
	SIGN_UP_INIT,
	SIGN_UP_SUCCESS,
	SIGN_UP_FAILURE,
	HOLD_SPLASHTAG,
	RESET_ONBOARDING,
	smsAuthInit,
	smsAuthSuccess,
	smsAuthFailure,
	smsConfirmInit,
	smsConfirmSuccess,
	smsConfirmFailure,
	signUpInit,
	signUpSuccess,
	signUpFailure,
	holdSplashtag,
	resetOnboarding
} from "../../src/redux/onboarding/actions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("onboarding actions", () => {
	it("smsAuthInit format", () => {
		const expectedAction = {
			type: SMS_AUTH_INIT,
			phoneNumber: "1234567890",
			countryName: "+1"
		};
		expect(smsAuthInit("1234567890", "+1")).toEqual(expectedAction);
	});
	it("smsAuthSuccess format", () => {
		const expectedAction = {
			type: SMS_AUTH_SUCCESS
		};
		expect(smsAuthSuccess()).toEqual(expectedAction);
	});
	it("smsAuthFailure format", () => {
		const expectedAction = {
			type: SMS_AUTH_FAILURE,
			error: "testError"
		};
		expect(smsAuthFailure("testError")).toEqual(expectedAction);
	});
	it("smsConfirmInit format", () => {
		const expectedAction = {
			type: SMS_CONFIRM_INIT
		};
		expect(smsConfirmInit()).toEqual(expectedAction);
	});
	it("smsConfirmSuccess format", () => {
		const expectedAction = {
			type: SMS_CONFIRM_SUCCESS
		};
		expect(smsConfirmSuccess()).toEqual(expectedAction);
	});
	it("smsConfirmFailure format", () => {
		const expectedAction = {
			type: SMS_CONFIRM_FAILURE,
			error: "testError"
		};
		expect(smsConfirmFailure("testError")).toEqual(expectedAction);
	});
	it("signUpInit format", () => {
		const expectedAction = {
			type: SIGN_UP_INIT
		};
		expect(signUpInit()).toEqual(expectedAction);
	});
	it("signUpSuccess format", () => {
		const expectedAction = {
			type: SIGN_UP_SUCCESS
		};
		expect(signUpSuccess()).toEqual(expectedAction);
	});
	it("signUpFailure format", () => {
		const expectedAction = {
			type: SIGN_UP_FAILURE,
			error: "testError"
		};
		expect(signUpFailure("testError")).toEqual(expectedAction);
	});
	it("holdSplashtag format", () => {
		const expectedAction = {
			type: HOLD_SPLASHTAG
		};
		expect(holdSplashtag()).toEqual(expectedAction);
	});
});
