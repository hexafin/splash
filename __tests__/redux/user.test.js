import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
	ActionTypes,
	setBiometric,
	logInInit,
	logInSuccess,
	logInFailure,
	updateUsernameInit,
	updateUsernameSuccess,
	updateUsernameFailure,
	loadContactsInit,
	loadContactsSuccess,
	loadContactsFailure,
	toggleLockout,
	resetUser,
	startLockoutClock,
	resetLockoutClock
} from "../../src/redux/user/actions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("user actions", () => {
	it("logInInit format", () => {
		const expectedAction = {
			type: ActionTypes.LOG_IN_INIT
		};
		expect(logInInit()).toEqual(expectedAction);
	});
	it("setBiometric format", () => {
		const expectedAction = {
			type: ActionTypes.SET_BIOMETRIC,
			enabled: true
		};
		expect(setBiometric(true)).toEqual(expectedAction);
	});
	it("logInSuccess format", () => {
		const expectedAction = {
			type: ActionTypes.LOG_IN_SUCCESS,
			userId: "testId",
			entity: {
				name: "testName"
			}
		};
		expect(
			logInSuccess("testId", {
				name: "testName"
			})
		).toEqual(expectedAction);
	});
	it("logInFailure format", () => {
		const expectedAction = {
			type: ActionTypes.LOG_IN_FAILURE,
			error: "testError"
		};
		expect(logInFailure("testError")).toEqual(expectedAction);
	});
	it("updateUsernameInit format", () => {
		const expectedAction = {
			type: ActionTypes.UPDATE_USERNAME_INIT
		};
		expect(updateUsernameInit()).toEqual(expectedAction);
	});
	it("updateUsernameSuccess format", () => {
		const expectedAction = {
			type: ActionTypes.UPDATE_USERNAME_SUCCESS,
			entity: {
				name: "newName"
			}
		};
		expect(updateUsernameSuccess({ name: "newName" })).toEqual(expectedAction);
	});
	it("updateUsernameFailure format", () => {
		const expectedAction = {
			type: ActionTypes.UPDATE_USERNAME_FAILURE
		};
		expect(updateUsernameFailure()).toEqual(expectedAction);
	});
	it("loadContactsInit format", () => {
		const expectedAction = {
			type: ActionTypes.LOAD_CONTACTS_INIT
		};
		expect(loadContactsInit()).toEqual(expectedAction);
	});
	it("loadContactsSuccess format", () => {
		const expectedAction = {
			type: ActionTypes.LOAD_CONTACTS_SUCCESS,
			contacts: ["contact1", "contact2"]
		};
		expect(loadContactsSuccess(["contact1", "contact2"])).toEqual(expectedAction);
	});
	it("loadContactsFailure format", () => {
		const expectedAction = {
			type: ActionTypes.LOAD_CONTACTS_FAILURE,
			error: "testError"
		};
		expect(loadContactsFailure("testError")).toEqual(expectedAction);
	});
	it("toggleLockout format", () => {
		const expectedAction = {
			type: ActionTypes.TOGGLE_LOCKOUT,
			toggle: true
		};
		expect(toggleLockout(true)).toEqual(expectedAction);
	});
	it("resetUser format", () => {
		const expectedAction = {
			type: ActionTypes.RESET_USER
		};
		expect(resetUser()).toEqual(expectedAction);
	});
	it("startLockoutClock format", () => {
		const expectedAction = {
			type: ActionTypes.START_LOCKOUT_CLOCK
		};
		expect(startLockoutClock()).toEqual(expectedAction);
	});
	it("resetLockoutClock format", () => {
		const expectedAction = {
			type: ActionTypes.RESET_LOCKOUT_CLOCK
		};
		expect(resetLockoutClock()).toEqual(expectedAction);
	});
});
