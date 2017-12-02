import {combineReducers} from "redux";
import general from "./general"
import transactions from "./transactions"
import routes from "./routes"

const walletApp = combineReducers({
    routes,
    general,
    transactions
})

export default walletApp