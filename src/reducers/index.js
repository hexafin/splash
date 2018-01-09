import general from "./general"
import transactions from "./transactions"
import crypto from "./crypto"
import routes from "./routes"
import { reducer as formReducer } from 'redux-form';


const walletApp = {
    routes,
    general,
    crypto,
    transactions,
   	form: formReducer
}

export default walletApp