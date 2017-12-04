import general from "./general"
import transactions from "./transactions"
import routes from "./routes"
import { reducer as formReducer } from 'redux-form';


const walletApp = {
    routes,
    general,
    transactions,
   	form: formReducer
}

export default walletApp