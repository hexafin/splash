import React from 'react'
import {
	Modal,
} from "react-native"
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import ViewTransactionModal from './ViewTransactionModal'
import ApproveTransactionModal from './ApproveTransactionModal'
import { hideModal } from '../redux/modal'

const MODAL_COMPONENTS = {
  'VIEW_TRANSACTION': ViewTransactionModal,
  'APPROVE_TRANSACTION': ApproveTransactionModal,
}

const ModalRoot = ({modalType, modalProps, hideModal}) => {
	if(!modalType) {
		return (null)
	} else {
		const Child = MODAL_COMPONENTS[modalType]
		return (
			<Modal
			    animationType="none"
		        transparent={true}
		        visible={true}>
		        <Child {...modalProps} hideModal={hideModal}/>
		    </Modal>
			)
	}
}

const mapStateToProps = state => state.modal

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			hideModal
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot)
