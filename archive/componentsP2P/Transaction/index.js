import Transaction from "./Transaction"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {friendsSearchChange} from "../../actions/general"

const friendSearch = (friends, query) => {
  // search username, name, and email
  const btcAddressValidator = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/
  const upperQuery = query.toUpperCase()
  const result = []

  if (btcAddressValidator.test(query)) {
    return [{
      type: 'friend',
      to_address: query,
      currency: 'BTC',
    }]
  }

  for (friend of friends) {
    const name = friend.first_name + ' ' + friend.last_name
    if (friend.username.toUpperCase().includes(upperQuery) || name.toUpperCase().includes(upperQuery) || friend.email.toUpperCase().includes(upperQuery)) {
      result.push(friend)
    }
  }
  return result
}

const mapStateToProps = (state) => {
  const friends = friendSearch(state.general.friends, state.general.friendsSearchQuery)

  // check if internal or external transaction
  let type = 'internal'
  if (friends.length > 0 && typeof friends[0].to_address !== 'undefined') {
    type = 'external'
  }
  return {
      type: type,
      friends: friends,
      loading: state.crypto.loading || state.general.isUpdatingFriends || state.general.isUpdatingExchangeRate,
  }
}

const mapDispatchToProps = (dispatch) => {
    dispatch(friendsSearchChange('')) // first clear the query
    return ({
        friendsSearchChange: (query) => {dispatch(friendsSearchChange(query))}
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
