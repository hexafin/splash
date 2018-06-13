import user from "./user/reducer"
import onboarding from "./onboarding/reducer"
import transactions from "./transactions/reducer"
import { reducer as formReducer } from 'redux-form';

const reducers = {
	user,
    onboarding,
   	form: formReducer,
	transactions
}

export default reducers
