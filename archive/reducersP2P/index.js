import general from "./general"
import transactions from "./transactions"
import waitlist from "./waitlist"
import crypto from "./crypto"
import routes from "./routes"
import { reducer as formReducer } from 'redux-form';


const walletApp = {
    routes,
    general,
    crypto,
    transactions,
    waitlist,
   	form: formReducer
}

export default walletApp
