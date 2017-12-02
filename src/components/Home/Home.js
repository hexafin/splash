// home page presentational component

import React from "react"
import {
    View,
    Text
} from "react-native"

const Home = (state) => {
    return (
        <Text>{state.signedIn}</Text>
    )
}

export default Home