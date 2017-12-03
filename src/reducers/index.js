import {combineReducers} from "redux";
import general from "./general"
import transactions from "./transactions"

const walletApp = combineReducers({
    general,
    transactions
})

export default walletApp