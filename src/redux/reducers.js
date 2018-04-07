import user from "./user/reducer"
import waitlist from "./waitlist/reducer"
import transactions from "./transactions/reducer"
import { reducer as formReducer } from 'redux-form';

const reducers = {
		user,
    waitlist,
   	form: formReducer,
		transactions
}

export default reducers
