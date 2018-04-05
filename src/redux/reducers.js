import user from "./user/reducer"
import waitlist from "./waitlist/reducer"
import transaction from "./transaction/reducer"
import { reducer as formReducer } from 'redux-form';

const reducers = {
		user,
    waitlist,
   	form: formReducer,
		transaction
}

export default reducers
