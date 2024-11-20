import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { Button } from "./ui/button"; // Assure-toi que ce chemin est correct

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-lg p-4">
        <Button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-0 -right-12"
        >
          ×
        </Button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
