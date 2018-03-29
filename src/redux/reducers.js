import user from "./user/reducer"
import waitlist from "./waitlist/reducer"
import { reducer as formReducer } from 'redux-form';

const reducers = {
	user,
    waitlist,
   	form: formReducer
}

export default reducers
