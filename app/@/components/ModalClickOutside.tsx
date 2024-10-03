import React, { ReactNode, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Gestionnaire des clics à l'extérieur de la modal
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose(); // Ferme la modal si le clic est à l'extérieur
    }
  };

  // Gestionnaire des clics à l'intérieur de la modal
  const handleModalClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Nettoyage : retirer l'écouteur d'événements lorsque la modal est fermée ou démontée
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null; // N'affiche pas la modal si elle n'est pas ouverte

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
      // Force le type de handleClickOutside pour éviter une erreur de type
      onClick={
        handleClickOutside as unknown as React.MouseEventHandler<HTMLDivElement>
      }
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg "
        onClick={handleModalClick} // Empêche la fermeture lors du clic à l'intérieur
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
