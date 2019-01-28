// reducer for modal actions

const initialState = {
  modalType: null,
  modalProps: {}
}

// modal reducer
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

// modal actions
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

export function showCardModal(modalProps) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'APPROVE_CARD',
    modalProps: modalProps,   
  }
}

export function hideModal() {
  return {
    type: 'HIDE_MODAL',
  }
}



