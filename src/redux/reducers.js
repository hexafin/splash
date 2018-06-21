import user from "./user/reducer"
import onboarding from "./onboarding/reducer"
import transactions from "./transactions/reducer"
import modal from "./modal"
import crypto from "./crypto/reducer"
import payFlow from "./payFlow"
import { reducer as formReducer } from 'redux-form';

const reducers = {
	user,
    onboarding,
   	form: formReducer,
	transactions,
	crypto,
	payFlow,
	modal
}

export default reducers
