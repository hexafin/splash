import React from 'react'
import {
	Modal,
} from "react-native"
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import ViewTransactionModal from '../ViewTransactionModal'
import ApproveTransactionModal from '../ApproveTransactionModal'
import ApproveCardModal from '../ApproveCardModal'
import DeleteContent from './content/DeleteContent'
import { hideModal } from '../../redux/modal'
import InfoModal from "./InfoModal"
import CardModal from "./CardModal"
import RaiseModal from "./RaiseModal"


const MODAL_COMPONENTS = {
  'VIEW_TRANSACTION': CardModal(ViewTransactionModal),
  'APPROVE_TRANSACTION': RaiseModal(ApproveTransactionModal),
  'APPROVE_CARD': RaiseModal(ApproveCardModal),
  'INFO': CardModal(InfoModal),
  'DELETE': CardModal(DeleteContent),
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
