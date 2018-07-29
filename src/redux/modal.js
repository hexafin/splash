const initialState = {
  modalType: null,
  modalProps: {}
}

export default function modal(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        modalType: action.modalType,
        modalProps: action.modalProps
      }
    case 'HIDE_MODAL':
      return initialState
    default:
      return state
  }
}

export function showViewModal(modalProps) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'VIEW_TRANSACTION',
    modalProps: modalProps,   
  }
}

export function showApproveModal(modalProps) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'APPROVE_TRANSACTION',
    modalProps: modalProps,   
  }
}

export function hideModal() {
  return {
    type: 'HIDE_MODAL',
  }
}



