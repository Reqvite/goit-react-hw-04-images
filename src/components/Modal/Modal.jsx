import { useEffect} from "react"

import { createPortal } from "react-dom"
import { Overlay, ModalStyled } from "./Modal.styled"

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ toggleModal, children }) => {
  useEffect(() => {
    window.addEventListener('keydown', closeModal);
    return () => {
      window.removeEventListener('keydown', closeModal);
    }
  })

  const closeModal = e => {
    if (e.code === 'Escape') {
      toggleModal()
    }
  }

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }
      return createPortal(
        <Overlay onClick={handleBackdropClick}>
  <ModalStyled >
        {children}
  </ModalStyled>
        </Overlay>,
        modalRoot
    )
}