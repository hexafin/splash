import Transaction from "./Transaction"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {friendsSearchChange} from "../../actions/general"

const friendSearch = (friends, query) => {
  // search username, name, and email
  const upperQuery = query.toUpperCase()
  const result = []
  for (friend of friends) {
    if (friend.username.toUpperCase().includes(upperQuery) || friend.name.toUpperCase().includes(upperQuery) || friend.email.toUpperCase().includes(upperQuery)) {
      result.push(friend)
    }
  }
  return result
}

const mapStateToProps = (state) => {
  return {
      friends: friendSearch(state.general.friends, state.general.friendsSearchQuery)
  }
}

const mapDispatchToProps = (dispatch) => {
    dispatch(friendsSearchChange('')) // first clear the query
    return ({
        friendsSearchChange: (query) => {dispatch(friendsSearchChange(query))}
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
