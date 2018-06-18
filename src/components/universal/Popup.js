import React from 'react'
import {
	Modal,
} from "react-native"

const Popup = ({visible, ...props, component}) => {
	const Child = component
	return (
		<Modal
		    animationType="none"
	        transparent={true}
	        visible={visible}>
	        {visible &&  <Child {...props}/>}
	    </Modal>
		)
}

export default Popup
