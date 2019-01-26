import React from "react"
import {
    View,
} from "react-native"
import {colors} from "../../lib/colors"
import PropTypes from "prop-types"


const Ring = ({size=80, ringPrimary=colors.white,
                ringSecondary="rgba(77, 0, 255, 0.08)", ringRatio=0.75, children}) => {

    const smallSize = size * ringRatio

    return (
        <View style={{
            width: size,
            height: size,
            borderRadius: size/2,
            backgroundColor: ringSecondary,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={{
                width: smallSize,
                height: smallSize,
                borderRadius: smallSize / 2,
                backgroundColor: ringPrimary,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                shadowOffset: {
        			width: 0,
        			height: 6,
        		},
        		shadowOpacity: 0.10,
        		shadowRadius: 33,
            }}>
                {children}
            </View>
        </View>
    )
}

Ring.propTypes = {
    size: PropTypes.number,
    ringPrimary: PropTypes.string,
    ringSecondary: PropTypes.string,
    ringRatio: PropTypes.number
}

export default Ring
