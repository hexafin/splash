import api from "../../api";
import firebase from "react-native-firebase";
import { Sentry } from "react-native-sentry";
import { reset } from "redux-form";
import Contacts from "react-native-contacts";

let firestore = firebase.firestore();
let analytics = firebase.analytics();
analytics.setAnalyticsCollectionEnabled(true);

export const ActionTypes = {
	LOG_IN_INIT: "LOG_IN_INIT",
	LOG_IN_SUCCESS: "LOG_IN_SUCCESS",
	LOG_IN_FAILURE: "LOG_IN_FAILURE",
	UPDATE_USERNAME_INIT: "UPDATE_USERNAME_INIT",
	UPDATE_USERNAME_SUCCESS: "UPDATE_USERNAME_SUCCESS",
	UPDATE_USERNAME_FAILURE: "UPDATE_USERNAME_FAILURE",
	LOAD_CONTACTS_INIT: "LOAD_CONTACTS_INIT",
	LOAD_CONTACTS_SUCCESS: "LOAD_CONTACTS_SUCCESS",
	LOAD_CONTACTS_FAILURE: "LOAD_CONTACTS_FAILURE",
	RESET_USER: "RESET_USER",
	START_LOCKOUT_CLOCK: "START_LOCKOUT_CLOCK",
	RESET_LOCKOUT_CLOCK: "RESET_LOCKOUT_CLOCK",
	TOGGLE_LOCKOUT: "TOGGLE_LOCKOUT",
	SET_BIOMETRIC: "SET_BIOMETRIC",
	NOTIFICATIONS_REQUESTED: "NOTIFICATIONS_REQUESTED"
};

export function logInInit() {
	return { type: ActionTypes.LOG_IN_INIT };
}

export function setBiometric(enabled) {
	return { type: ActionTypes.SET_BIOMETRIC, enabled };
}

export function logInSuccess(userId, entity) {
	return {
		type: ActionTypes.LOG_IN_SUCCESS,
		userId,
		entity
	};
}

export function logInFailure(error) {
	return { type: ActionTypes.LOG_IN_FAILURE, error };
}

export function updateUsernameInit() {
	return { type: ActionTypes.UPDATE_USERNAME_INIT };
}

export function updateUsernameSuccess(entity) {
	return { type: ActionTypes.UPDATE_USERNAME_SUCCESS, entity };
}

export function updateUsernameFailure(error) {
	return { type: ActionTypes.UPDATE_USERNAME_FAILURE, error };
}

export function loadContactsInit() {
	return { type: ActionTypes.LOAD_CONTACTS_INIT };
}

export function loadContactsSuccess(contacts) {
	return { type: ActionTypes.LOAD_CONTACTS_SUCCESS, contacts };
}

export function loadContactsFailure(error) {
	return { type: ActionTypes.LOAD_CONTACTS_FAILURE, error };
}

export function toggleLockout(toggle) {
	return { type: ActionTypes.TOGGLE_LOCKOUT, toggle };
}

export function resetUser() {
	return { type: ActionTypes.RESET_USER };
}

export function startLockoutClock() {
	return { type: ActionTypes.START_LOCKOUT_CLOCK };
}

export function resetLockoutClock() {
	return { type: ActionTypes.RESET_LOCKOUT_CLOCK };
}


export const LogIn = userId => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			const state = getState();

			dispatch(logInInit());

			firestore
				.collection("users")
				.doc(userId)
				.get()
				.then(userDoc => {
					const userData = userDoc.data();
					Sentry.setUserContext({
						userId: userId,
						username: userData.splashtag
					});

					dispatch(logInSuccess(userId, userData));
					resolve();
				})
				.catch(error => {
					Sentry.captureMessage(error);
					dispatch(logInFailure(error));
					reject(error);
				});
		});
	};
};

// change username in state and database
export const ChangeUsername = () => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(updateUsernameInit());
			const state = getState();
			const uid = state.user.id;
			const updatedUsername = state.form.updateSplashtag.values.updateUsername;
			// update username on firebase
			api.UpdateUser(uid, { splashtag: updatedUsername })
				.then(userData => {
					dispatch(updateUsernameSuccess(userData)); // update splashtag on redux
					resolve();
					dispatch(reset("updateSplashtag")); // reset form
				})
				.catch(error => {
					Sentry.captureMessage(error);
					dispatch(updateUsernameFailure(error));
					dispatch(reset("updateSplashtag"));  // reset form
					reject(error);
				});
		});
	};
};

export const LoadContacts = () => {
	return async (dispatch, getState) => {
		const state = getState();

		// object of contacts keyed by number
		let oldContacts = state.user.contacts.reduce((map, obj) => {
			map[obj.phoneNumber] = obj;
			return map;
		}, {});

		let friends = {};

		dispatch(loadContactsInit());

		const convertPhoneNumber = number => {
			number = number.replace(/[^0-9]/g, "");
			if (number.length > 10) {
				return "+" + number;
			} else if (number.length == 10 && state.crypto.activeCurrency == "USD") {
				return "+1" + number;
			} else {
				return number;
			}
		};

		try {
			// get all contacts
			Contacts.getAll(async (error, contacts) => {
				if (!error) {
					await Promise.all(
						contacts.map(async contact => {
							if (contact.phoneNumbers[0]) {
								const number = convertPhoneNumber(contact.phoneNumbers[0].number); // standardize numbers
								// if this is a new number
								if (!Object.values(oldContacts).includes(number)) {
									// check firestore for users with this number
									const query = await firestore
										.collection("users")
										.where("phoneNumber", "==", number)
										.get();
									if (!query.empty && query.size == 1) { // if the user exists create a contact
										const data = query.docs[0].data();
										const uid = query.docs[0].id;
										const newContact = {
											splashtag: data.splashtag,
											phoneNumber: data.phoneNumber,
											objectID: uid,
											wallets: data.wallets
										};
										friends[data.phoneNumber] = newContact;
									}
								} else {
									friends[number] = oldContacts[number];
								}
							}
						})
					);
					// add contacts to redux
					dispatch(loadContactsSuccess(Object.values(friends)));
				} else {
					dispatch(loadContactsFailure(error));
				}
			});
		} catch (error) {
			dispatch(loadContactsFailure(error));
		}
	};
};
